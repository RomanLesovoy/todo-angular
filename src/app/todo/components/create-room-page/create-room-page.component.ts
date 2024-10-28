import { Component, DestroyRef, Inject } from '@angular/core';
import { RoomServiceService } from '../../services/room-service.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-room-page',
  templateUrl: './create-room-page.component.html',
  styleUrl: './create-room-page.component.scss'
})
export class CreateRoomPageComponent {
  constructor(
    @Inject(RoomServiceService) private readonly roomService: RoomServiceService,
    @Inject(DestroyRef) private readonly destroyRef: DestroyRef,
  ) {}

  onCreateRoom() {
    this.roomService.createRoom().pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }
}
