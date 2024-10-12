import { Inject, Injectable } from '@angular/core';
import { Ticket } from '../interfaces';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { BehaviorSubject, delay, tap } from 'rxjs';
import { RoomServiceService } from './room-service.service';

@Injectable({
  providedIn: 'root'
})
export class TicketServiceService {
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    @Inject(HttpClient) private readonly httpClient: HttpClient,
    @Inject(ConfigService) private readonly configService: ConfigService,
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
  ) {}

  private _updateTodoColumn(ticket: Ticket, type: 'remove' | 'edit') {
    const todos = this.roomService.currentRoom.value!.todos;
    const todoKey = String(ticket.columnId);
    const values = {
      remove: () => todos[todoKey].filter((t) => t.id !== ticket.id),
      edit: () => todos[todoKey] = todos[todoKey].map((t) => ticket.id !== t.id ? t : ticket)
    }
    this.roomService.currentRoom.next({
      ...this.roomService.currentRoom.value!,
      todos: { ...todos, [todoKey]: values[type]() }
    })
  }

  public removeTicket(ticket: Ticket) {
    this.isLoading.next(true);
    return this.httpClient.delete(`${this.configService.sourceV1}/todo/${ticket.id}`)
      .pipe(
        delay(200),
        tap({
          next: () => this._updateTodoColumn(ticket, 'remove'),
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
          next: () => this._updateTodoColumn(ticket, 'edit'),
          error: (e) => {console.error(e)},
          complete: () => {
            this.isLoading.next(false);
          }
        })
      )
  }
}
