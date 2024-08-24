import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'honda/:tag',
        loadComponent: () => import('./pages/honda/honda.component').then((c) => c.HondaComponent),
        data: { page_name: 'honda' }
      },
      {
        path: 'thankyou',
        loadComponent: () => import('./pages/thankyou/thankyou.component').then((c) => c.ThankyouComponent),
        data: { page_name: 'thank_you' }
      },
      {
        path: 'stories/:tag',
        loadComponent: () => import('./pages/story/story.component').then((c) => c.StoryComponent),
        data: { page_name: 'stories' }
      },
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found.component').then((c) => c.NotFoundComponent),
        data: { page_name: 'page_not_found' }
      },
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent),
        data: { page_name: 'home' }
      },
      {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
      }
    ]
  }
];
