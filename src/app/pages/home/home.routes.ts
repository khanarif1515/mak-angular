import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home.component').then((c) => c.HomeComponent),
    data: {
      page_name: 'home'
    }
  }
];