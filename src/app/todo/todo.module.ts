import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule} from '@angular/material/card';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { routes } from './todo.routes';
import { RoomIdGuard } from './guards/roomId.guard';
import { RoomComponent } from './components/room/room.component';
import { RoomServiceService } from './services/room-service.service';
import { RootComponent } from './components/root/root.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { provideHttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { BoardComponent } from './components/board/board.component';
import { TicketComponent } from './components/tickets/ticket/ticket.component';
import { TicketServiceService } from './services/ticket-service.service';
import { EditableComponent } from './components/editable/editable.component';
import { FormsModule } from '@angular/forms';
import { SocketService } from './services/socket.service';
import { NotificationService } from './services/notification.service';

@NgModule({
  declarations: [
    RootComponent,
    RoomComponent,
    BoardComponent,
    TicketComponent,
    EditableComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RouterLink,
    RouterLinkActive,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatButtonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [RouterModule],
  providers: [
    RoomIdGuard,
    RoomServiceService,
    TicketServiceService,
    SocketService,
    NotificationService,
    provideHttpClient(),
  ]
})
export class TodoModule { }
