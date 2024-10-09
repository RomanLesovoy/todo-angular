import { Routes } from '@angular/router';
import { RoomComponent } from './components/rooms/room/room.component';
import { RoomIdGuard } from './guards/roomId.guard';
import { RootComponent } from './components/root/root.component';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'room/:hash',
        component: RoomComponent,
        canActivate: [RoomIdGuard],
      }
    ]
  },
];
