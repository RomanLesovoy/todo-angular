import { Component, Inject } from '@angular/core';
import { RoomServiceService } from '../../services/room-service.service';

@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.component.html',
  styleUrl: './create-room-page.component.scss'
})
export class CreateRoomPageComponent {
  constructor(@Inject(RoomServiceService) private readonly roomService: RoomServiceService) {}

  onCreateRoom() {
    this.roomService.createRoom().subscribe();
  }
}
