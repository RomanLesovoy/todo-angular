import { Component } from '@angular/core';
import { RoomServiceService } from '../../services/room-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent {
  loading: boolean = false;

  constructor(private readonly roomService: RoomServiceService) {
    this.roomService.isLoading.subscribe(l => this.loading = l);
  }
}
