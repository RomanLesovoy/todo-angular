import { io } from 'socket.io-client';
import { Injectable, OnDestroy } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { ConfigService } from './config.service';

export type Action = 'create' | 'update' | 'delete';
export type Type = 'todo' | 'column';
export interface IToDoMessage {
  action: Action,
  type: Type,
  value: any,
  roomHash: string,
}

@Injectable({
  providedIn: 'root'
})
export class SocketService implements OnDestroy {
  public socket;

  constructor(
    private configService: ConfigService
  ) {
    this.socket = io(this.configService.sourceWs, {
      reconnectionAttempts: 3,
      reconnection: true,
      transports: ['websocket'], // 'polling' was deleted
      port: 443,
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
    return new Observable<IToDoMessage>((observer) => {
      const handler = (message: IToDoMessage) => observer.next(message);

      this.socket.on('roomUpdate', handler);

      return () => {
        this.leaveRoom(roomHash);
        this.socket?.off('roomUpdate', handler)
      };
    }).pipe(shareReplay(1)); // shareReplay(1) avoid memory leak (subscribes to socket only once if multiple subscriptions)
  }

  public leaveRoom(roomHash: string) {
    this.socket?.emit('leaveRoom', roomHash);
  }

  ngOnDestroy() {
    this.socket?.disconnect();
  }
}
