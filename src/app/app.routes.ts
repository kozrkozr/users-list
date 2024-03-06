import { Routes } from '@angular/router';

export enum AppRoutes {
  UsersList = 'users-list'
}

export const APP_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: AppRoutes.UsersList
  },
  {
    path: AppRoutes.UsersList,
    loadComponent: () => import('./pages/users-list/users-list.component').then((c) => c.UsersListComponent)
  }
];
