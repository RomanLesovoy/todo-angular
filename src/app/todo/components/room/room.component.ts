import { Component, Inject } from '@angular/core';
import { RoomServiceService } from '../../services/room-service.service';
import { RoomPrepared } from '../../interfaces';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {
  public room?: RoomPrepared;

  constructor(
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
  ) {
    this.roomService.currentRoom.subscribe(r => r && (this.room = r));
  }
}
