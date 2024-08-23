import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./thankyou.component').then((c) => c.ThankyouComponent),
    data: {
      page_name: 'thank_you'
    }
  }
];