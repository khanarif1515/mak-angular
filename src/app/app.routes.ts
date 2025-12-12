import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TPageOrigins } from './shared/models/layout.model';

interface ILayoutRouteData {
  or: TPageOrigins;
}

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./pages/auth/auth.component').then(c => c.AuthComponent),
        data: { or: 'si' } as ILayoutRouteData
      },
      {
        path: 'story/:tag',
        loadComponent: () => import('./pages/story/story.component').then(c => c.StoryComponent),
        data: { or: 's' } as ILayoutRouteData
      },
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
        data: { or: '404' } as ILayoutRouteData
      },
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
        data: { or: 'h' } as ILayoutRouteData
      }
    ]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
