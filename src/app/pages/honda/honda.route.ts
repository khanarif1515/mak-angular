import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':tag',
    loadComponent: () => import('./honda.component').then((c) => c.HondaComponent),
    data: {
      page_name: 'honda'
    }
  }
];