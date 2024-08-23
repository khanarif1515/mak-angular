import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./amaze-mh-12-pq-4787.component').then((c) => c.AmazeMH12PQ4787Component),
    data: {
      page_name: 'honda_amaze'
    }
  }
];