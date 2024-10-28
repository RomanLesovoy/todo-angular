import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'rooms', pathMatch: 'full' },
  {
    path: 'rooms', loadChildren: () => import('./todo/todo.module').then((m) => m.TodoModule),
  },
  { path: '**', redirectTo: 'rooms' },
];
