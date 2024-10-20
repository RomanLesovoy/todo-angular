import { Inject, Injectable } from '@angular/core';
import { GeneralResponse, Ticket, TicketCreateRequest } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { BehaviorSubject, delay, filter, map, Observable, tap } from 'rxjs';
import { RoomServiceService } from './room-service.service';
import { IToDoMessage } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class TicketServiceService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject(HttpClient) private readonly httpClient: HttpClient,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
  ) {
    this.roomService.roomWs$
      .pipe(filter((v: IToDoMessage) => v.type === 'todo'))
      .subscribe((v) => this.updateTodoColumn(v.value, v.action))
  }

  private updateTodoColumn(ticket: Ticket, type: 'delete' | 'update' | 'create') {
    const todos = this.roomService.currentRoom.value!.todos;
    const todoKey = String(ticket.columnId);
    const actions = {
      create: () => todos[todoKey] = todos[todoKey] ? todos[todoKey].concat(ticket) : [ticket],
      delete: () => todos[todoKey].filter((t) => t.id !== ticket.id),
      update: () => todos[todoKey] = todos[todoKey].map((t) => ticket.id !== t.id ? t : ticket)
    }
    this.roomService.currentRoom.next({
      ...this.roomService.currentRoom.value!,
      todos: { ...todos, [todoKey]: actions[type]() }
    })
  }

  public createTicket(colId: number): Observable<Ticket> {
    this.isLoading.next(true);
    interface Response extends GeneralResponse { todo: Ticket };
    return (this.httpClient.post(`${this.configService.sourceV1}/todo`, ({ title: 'New Ticket', roomHash: this.roomService.currentRoomHash.value, columnId: colId, isCompleted: false } as TicketCreateRequest)) as Observable<Response>)
    .pipe(
      delay(500),
      tap({
        next: () => {}, // todo notify about new ticket
        error: (e) => {console.error(e)},
        finalize: () => this.isLoading.next(false),
      }),
      map((v) => v.todo)
    )
  }

  public removeTicket(ticket: Ticket) {
    this.isLoading.next(true);
    return this.httpClient.delete(`${this.configService.sourceV1}/todo/${ticket.id}`)
      .pipe(
        delay(200),
        tap({
          next: () => {}, // todo notify about ticket removal
          error: (e) => {console.error(e)},
          complete: () => {
            this.isLoading.next(false);
          }
        })
      )
  }

  public editTicket(ticket: Ticket) {
    this.isLoading.next(true);
    return this.httpClient.patch(`${this.configService.sourceV1}/todo/${ticket.id}`, ticket)
      .pipe(
        delay(200),
        tap({
          next: () => {}, // todo notify about ticket update
          error: (e) => {console.error(e)},
          complete: () => {
            this.isLoading.next(false);
          }
        })
      )
  }
}
