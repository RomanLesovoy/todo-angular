import { Inject, Injectable } from '@angular/core';
import { Observable, map, delay, BehaviorSubject, tap } from 'rxjs';
import { Column, ColumnRequest, GeneralResponse, RoomDto, RoomPrepared, Ticket, TicketCreateRequest } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  public currentRoom: BehaviorSubject<RoomPrepared | null> = new BehaviorSubject(null) as BehaviorSubject<RoomPrepared | null>;
  public currentRoomHash: BehaviorSubject<string> = new BehaviorSubject('');
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject(HttpClient) private readonly httpClient: HttpClient,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(Router) private readonly router: Router,
  ) {}

  public createRoom(): Observable<string> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { roomHash?: string };
    return (this.httpClient.post(`${this.configService.sourceV1}/room`, { name: Date.now().toString() }) as Observable<Response>)
      .pipe(
        delay(500),
        tap({
          next: (v) => v && v.roomHash && (this.router.navigateByUrl('/rooms/room/' + v.roomHash)),
          error: (e) => console.error(e),
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
          error: (e) => {console.error(e)},
          finalize: () => this.isLoading.next(false)
        }),
        map((v) => !!v.success),
      )
  }

  public createTicket(colId: number): Observable<Ticket> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { todo: Ticket };
    return (this.httpClient.post(`${this.configService.sourceV1}/todo`, ({ title: 'New Ticket', roomHash: this.currentRoomHash.value, columnId: colId, isCompleted: false } as TicketCreateRequest)) as Observable<Response>)
    .pipe(
      delay(500),
      tap({
        next: (res) => {
          if (res.success && res.todo) {
            const currentRoomV = this.currentRoom.value!;
            const columnTodos = currentRoomV.todos[colId]?.length ? currentRoomV.todos[colId] : [];
            const todos = { ...currentRoomV.todos, [colId]: [ ...columnTodos, res.todo ] }
            this.currentRoom.next({ ...currentRoomV, todos });
          }
        },
        error: (e) => {console.error(e)},
        finalize: () => this.isLoading.next(false),
      }),
      map((v) => v.todo)
    )
  }

  public createColumn(): Observable<Column> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { column: Column };
    return (this.httpClient.post(`${this.configService.sourceV1}/column`, ({ name: 'New Column', roomHash: this.currentRoomHash.value } as ColumnRequest)) as Observable<Response>)
      .pipe(
        delay(500),
        tap({
          next: (res) => {
            if (res.success && res.column) {
              const currentRoomV = this.currentRoom.value!;
              this.currentRoom.next({ ...currentRoomV, columns: [...currentRoomV.columns, res.column] });
            }
          },
          error: (e) => {console.error(e)},
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
        delay(500),
        tap({
          next: (res) => {
            if (res.success) {
              const currentRoomV = this.currentRoom.value!;
              const updatedColumns = currentRoomV.columns.map((c) => c.id !== column.id ? c : column);
              this.currentRoom.next({ ...currentRoomV, columns: updatedColumns });
            }
          },
          error: (e) => {console.error(e)},
          finalize: () => this.isLoading.next(false),
        }),
        map((v) => !!v.success)
      )
  }

  public removeColumn(col: Column): Observable<boolean> {
    this.isLoading.next(true);
    return (this.httpClient.delete(`${this.configService.sourceV1}/column/${col.id}`) as Observable<GeneralResponse>)
      .pipe(
        delay(500),
        tap({
          next: (res) => {
            if (res.success) {
              const currentRoomV = this.currentRoom.value!;
              const updatedColumns = currentRoomV.columns.filter((c) => c.id !== col.id);
              this.currentRoom.next({ ...currentRoomV, columns: updatedColumns });
            }
          },
          error: (e) => {console.error(e)},
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
}
