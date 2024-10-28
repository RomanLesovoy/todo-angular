import { Inject, Injectable } from '@angular/core';
import { Observable, map, delay, BehaviorSubject, tap, switchMap, from, filter } from 'rxjs';
import { Column, ColumnRequest, GeneralResponse, RoomDto, RoomPrepared } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';
import { SocketService, IToDoMessage, Action } from './socket.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  public currentRoom: BehaviorSubject<RoomPrepared | null> = new BehaviorSubject(null) as BehaviorSubject<RoomPrepared | null>;
  public currentRoomHash: BehaviorSubject<string> = new BehaviorSubject('');
  private previousRoomHash: string = '';
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public roomWs$: Observable<IToDoMessage>;

  constructor(
    @Inject(HttpClient) private readonly httpClient: HttpClient,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(Router) private readonly router: Router,
    @Inject(SocketService) private readonly socketService: SocketService,
    @Inject(NotificationService) private readonly notificationService: NotificationService,
  ) {
    this.roomWs$ = from(this.currentRoomHash).pipe(
      filter((v) => !!v),
      switchMap((v: string) => {
        this.previousRoomHash && this.socketService.leaveRoom(this.previousRoomHash);
        this.previousRoomHash = v;
        return this.socketService.subscribeToRoom(v);
      }),
    );

    this.roomWs$
      .pipe(filter((v: IToDoMessage) => v.type === 'column'))
      .subscribe((v) => this.updateRoomColums(v.value, v.action))
  }

  public createRoom(): Observable<string> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { roomHash?: string };
    return (this.httpClient.post(`${this.configService.sourceV1}/room`, { name: Date.now().toString() }) as Observable<Response>)
      .pipe(
        delay(500),
        tap({
          next: (v) => v && v.roomHash && (this.router.navigateByUrl('/rooms/room/' + v.roomHash)),
          error: (e) => this.notificationService.pushErrorNotification(e),
          finalize: () => this.isLoading.next(false)
        }),
        map(v => v.roomHash!)
      )
  }

  public setRoomIfExists(roomHash: string): Observable<boolean> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { room?: RoomDto };
    return (this.httpClient.get(`${this.configService.sourceV1}/room/${roomHash}`) as Observable<Response>)
      .pipe(
        delay(1000),
        tap({
          next: (v) => {
            if (v.success && v.room) {
              this.currentRoomHash.next(roomHash);
              this.currentRoom.next(this.prepareRoom(v.room));
            }
          },
          error: (e) => this.notificationService.pushErrorNotification(e),
          finalize: () => this.isLoading.next(false)
        }),
        map((v) => !!v.success),
      )
  }

  public createColumn(): Observable<Column> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { column: Column };
    return (this.httpClient.post(`${this.configService.sourceV1}/column`, ({ name: 'New Column', roomHash: this.currentRoomHash.value } as ColumnRequest)) as Observable<Response>)
      .pipe(
        tap({
          error: (e) => this.notificationService.pushErrorNotification(e),
          finalize: () => this.isLoading.next(false),
        }),
        map((v) => v.column)
      )
  }

  public editColumn(column: Column): Observable<boolean> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { column?: Column };
    return (this.httpClient.patch(`${this.configService.sourceV1}/column/${column.id}`, column) as Observable<Response>)
      .pipe(
        tap({
          error: (e) => this.notificationService.pushErrorNotification(e),
          finalize: () => this.isLoading.next(false),
        }),
        map((v) => !!v.success)
      )
  }

  public removeColumn(col: Column): Observable<boolean> {
    this.isLoading.next(true);
    return (this.httpClient.delete(`${this.configService.sourceV1}/column/${col.id}`) as Observable<GeneralResponse>)
      .pipe(
        tap({
          error: (e) => this.notificationService.pushErrorNotification(e),
          finalize: () => this.isLoading.next(false),
        }),
        map((v) => !!v.success)
      )
  }

  private prepareRoom(room: RoomDto): RoomPrepared {
    return {
      ...room,
      todos: room.todos.reduce((acc, t) => {
        const columnKey = String(t.columnId);
        // @ts-ignore
        acc[columnKey] ? acc[columnKey].push(t) : acc[columnKey] = [t];
        return acc;
      }, {})
    }
  }

  private updateRoomColums(column: Column, type: Action) {
    const room = this.currentRoom.value!;
    this.notificationService.pushUpdateNotification(type);
    const actions = {
      create: () => this.currentRoom.next({ ...room, columns: [...room.columns || [], column] }),
      delete: () => this.currentRoom.next({ ...room, columns: room.columns.filter((c) => c.id !== column.id), }),
      update: () => this.currentRoom.next({ ...room, columns: room.columns.map((c) => c.id !== column.id ? c : column) }),
    }
    actions[type]();
  }
}
