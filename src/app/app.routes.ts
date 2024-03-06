import { Routes } from '@angular/router';
import { adminGuard } from './shared/guards/admin-guard';

export enum AppRoutes {
  UsersList = 'users-list',
  Admin = 'admin',
  AccessDenied = 'access-denied'
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
  },
  {
    path: AppRoutes.Admin,
    loadComponent: () => import('./pages/admin/admin.component').then((c) => c.AdminComponent),
    canActivate: [adminGuard()]
  },
  {
    path: AppRoutes.AccessDenied,
    loadComponent: () => import('./pages/access-denied/access-denied.component').then((c) => c.AccessDeniedComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
  }
];
