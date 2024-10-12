import { Injectable } from '@angular/core';
import { Observable, map, delay, BehaviorSubject, tap } from 'rxjs';
import { Column, GeneralResponse, RoomDto, RoomPrepared } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  public currentRoom: BehaviorSubject<RoomPrepared | null> = new BehaviorSubject(null) as BehaviorSubject<RoomPrepared | null>;
  public currentRoomHash: BehaviorSubject<string> = new BehaviorSubject('');
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private readonly httpClient: HttpClient,
    private readonly configService: ConfigService,
  ) {}

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
