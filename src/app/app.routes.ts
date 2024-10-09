import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'rooms', loadChildren: () => import('./todo/todo.module').then((m) => m.TodoModule),
  },
];
