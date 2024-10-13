import { Routes } from '@angular/router';
import { RoomComponent } from './components/room/room.component';
import { RoomIdGuard } from './guards/roomId.guard';
import { RootComponent } from './components/root/root.component';
import { CreateRoomPageComponent } from './components/create-room-page/create-room-page.component';

export const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        component: CreateRoomPageComponent,
      },
      {
        path: 'room/:hash',
        component: RoomComponent,
        canActivate: [RoomIdGuard],
      },
    ]
  },
];
