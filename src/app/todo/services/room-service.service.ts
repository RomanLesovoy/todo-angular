import { Injectable } from '@angular/core';
import { Observable, map, from, filter, delay, BehaviorSubject, tap } from 'rxjs';
import { RoomDto } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  public currentRoom: BehaviorSubject<RoomDto | null> = new BehaviorSubject(null) as BehaviorSubject<RoomDto | null>;
  public currentRoomHash: BehaviorSubject<string> = new BehaviorSubject('');
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {
    this.currentRoomHash.pipe(
      filter(v => !!v)
    ).subscribe((hash) => {
      this.currentRoom.next({ name: 'Room 1', hash,  columns: [], tickets: [] });
      this.isLoading.next(false);
      // todo get current room from back end
    })
  }

  public setRoomIfExists(roomHash: string): Observable<boolean> {
    this.isLoading.next(true);
    return from(['123']).pipe( // todo needs real values
      delay(1500),
      filter((route) => route === roomHash),
      map((v) => !!v),
      tap({
        next: () => this.currentRoomHash.next(roomHash),
        error: () => {},
      }),
    )
  }
}
