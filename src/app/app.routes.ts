import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'honda/amaze',
        loadComponent: () => import('./pages/honda-amaze/honda-amaze.component').then(c => c.HondaAmazeComponent),
        data: { origin: 'haz' }
      },
      {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
        data: { origin: 'su' }
      },
      {
        path: 'signin',
        loadComponent: () => import('./pages/signin/signin.component').then(c => c.SigninComponent),
        data: { origin: 'si' }
      },
      {
        path: 'stories/:tag',
        loadComponent: () => import('./pages/story/story.component').then(c => c.StoryComponent),
        data: { origin: 's' }
      },
      {
        path: '404',
        loadComponent: () => import('./pages/no-page/no-page.component').then(c => c.NoPageComponent),
        data: { origin: '404' }
      },
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
        data: { origin: 'h' }
      }
    ]
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full'
  }
];
