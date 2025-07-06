import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'story/:tag',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehicle/:brand/:model',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehicle/:brand',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
