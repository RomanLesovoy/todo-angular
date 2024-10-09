import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { routes } from './todo.routes';
import { RoomIdGuard } from './guards/roomId.guard';
import { RoomComponent } from './components/rooms/room/room.component';
import { RoomServiceService } from './services/room-service.service';
import { RootComponent } from './components/root/root.component';

@NgModule({
  declarations: [RootComponent, RoomComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterLink,
    RouterLinkActive,
    MatProgressSpinnerModule,
  ],
  exports: [RouterModule],
  providers: [RoomIdGuard, RoomServiceService]
})
export class TodoModule { }
