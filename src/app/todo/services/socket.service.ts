import { io } from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

export interface IToDoMessage {
  action: 'create' | 'update' | 'delete',
  type: 'todo' | 'column',
  value: any, // Todo fixme
  roomHash: string,
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket;

  constructor(private configService: ConfigService) {
    this.socket = io(this.configService.sourceWs, {
      transports: ['websocket', 'polling'],
      // path: '/todo',
    });

    this.socket.on('connect_error', (error) => {
      console.error(error);
    });
  }

  sendMessage(message: string) {
    this.socket.emit('message', message);
  }

  subscribeToRoom(roomHash: string): Observable<IToDoMessage> {
    this.socket.emit('joinRoom', roomHash);
    return new Observable((observer) => {
      this.socket.on('roomUpdate', (message: IToDoMessage) => {
        observer.next(message);
      });
    })
  }
}
