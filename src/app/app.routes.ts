import { Routes } from '@angular/router';
import { TPageOrigins } from './shared/models/layout.model';
import { Layout } from './layout/layout';

interface ILayoutRouteData {
  or: TPageOrigins;
}

export const routes: Routes = [{
  path: '', component: Layout,
  children: [
    {
      path: '404',
      loadComponent: () => import('./pages/not-found/not-found').then(c => c.NotFound),
      data: { or: '404' } as ILayoutRouteData
    },
    {
      path: 'about-us',
      loadComponent: () => import('./pages/about-us/about-us').then(c => c.AboutUs),
      data: { or: 'abs' } as ILayoutRouteData
    },
    {
      path: 'login',
      loadComponent: () => import('./pages/login/login.component').then(c => c.LoginComponent),
      data: { or: 'ln' } as ILayoutRouteData
    },
    {
      path: 'signup',
      loadComponent: () => import('./pages/signup/signup.component').then(c => c.SignupComponent),
      data: { or: 'sp' } as ILayoutRouteData
    },
    {
      path: 'profile',
      loadComponent: () => import('./pages/profile/profile').then(c => c.Profile),
      data: { or: 'prf' } as ILayoutRouteData
    },
    {
      path: 'story/:tag',
      loadComponent: () => import('./pages/story/story').then(c => c.Story),
      data: { or: 's' } as ILayoutRouteData
    },
    {
      path: 'vehicle/:brand/:model',
      loadComponent: () => import('./pages/vehicle/vehicle').then(c => c.Vehicle),
      data: { or: 'veh' } as ILayoutRouteData
    },
    {
      path: 'vehicle/:brand',
      loadComponent: () => import('./pages/vehicle/vehicle').then(c => c.Vehicle),
      data: { or: 'veh_br' } as ILayoutRouteData
    },
    {
      path: 'unknown',
      loadComponent: () => import('./pages/vehicle/vehicle').then(c => c.Vehicle),
    },
    {
      path: '', pathMatch: 'full',
      loadComponent: () => import('./pages/home/home').then(c => c.Home),
      data: { or: 'h' } as ILayoutRouteData
    }
  ]
}];
