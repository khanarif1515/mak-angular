import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'honda', loadChildren: () => import('./pages/honda/honda.route').then(r => r.routes)},
      { path: 'thankyou', loadChildren: () => import('./pages/thankyou/thankyou.routes').then(r => r.routes) },
      { path: 'stories', loadChildren: () => import('./pages/story/story.routes').then(r => r.routes) },
      { path: '404', loadChildren: () => import('./pages/not-found/not-found.routes').then(r => r.routes) },
      { path: '', loadChildren: () => import('./pages/home/home.routes').then(r => r.routes) },
      { path: '**', redirectTo: '', pathMatch: 'full' }
    ]
  }
];
