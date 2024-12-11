import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
    { path: 'dashboard', renderMode: RenderMode.Client },
    { path: '**', renderMode: RenderMode.Server }
];
