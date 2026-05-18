import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin'),
    loadChildren: () => import('./admin/admin.routes')
  }
];
