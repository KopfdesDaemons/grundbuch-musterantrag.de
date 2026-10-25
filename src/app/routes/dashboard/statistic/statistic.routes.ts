import { Routes } from '@angular/router';

export const statisticRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/router.component').then(m => m.RouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./count/count.component').then(m => m.CountComponent)
      },
      {
        path: 'time-tracking',
        loadComponent: () => import('./time-tracking/time-tracking.component').then(m => m.TimeTrackingComponent)
      }
    ]
  }
];
