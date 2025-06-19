import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { TPageOrigins } from './shared/models/layout.model';

interface ILayoutRouteData {
  or: TPageOrigins;
}

export const routes: Routes = [{
  path: '', component: LayoutComponent,
  children: [
    {
      path: '404',
      loadComponent: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent),
      data: { or: '404' } as ILayoutRouteData
    },
    {
      path: 'about-us',
      loadComponent: () => import('./pages/about-us/about-us.component').then(c => c.AboutUsComponent),
      data: { or: 'abs' } as ILayoutRouteData
    },
    {
      path: 'profile',
      loadComponent: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent),
      data: { or: 'prf' } as ILayoutRouteData
    },
    {
      path: 'story/:tag',
      loadComponent: () => import('./pages/story/story.component').then(c => c.StoryComponent),
      data: { or: 's' } as ILayoutRouteData
    },
    {
      path: 'vehicle/:brand/:model',
      loadComponent: () => import('./pages/vehicle/vehicle.component').then(c => c.VehicleComponent),
      data: { or: 'veh' } as ILayoutRouteData
    },
    {
      path: 'vehicle/:brand',
      loadComponent: () => import('./pages/vehicle/vehicle.component').then(c => c.VehicleComponent),
      data: { or: 'veh_br' } as ILayoutRouteData
    },
    {
      path: 'unknown',
      loadComponent: () => import('./pages/vehicle/vehicle.component').then(c => c.VehicleComponent),
    },
    {
      path: '', pathMatch: 'full',
      loadComponent: () => import('./pages/home/home.component').then(c => c.HomeComponent),
      data: { or: 'h' } as ILayoutRouteData
    }
  ]
}];
