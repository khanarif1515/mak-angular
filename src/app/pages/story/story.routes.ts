import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':tag',
    loadComponent: () => import('./story.component').then((c) => c.StoryComponent),
    data: {
      page_name: 'stories'
    }
  }
];