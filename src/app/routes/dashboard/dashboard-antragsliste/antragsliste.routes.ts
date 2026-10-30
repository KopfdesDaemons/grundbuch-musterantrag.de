import { Routes } from '@angular/router';

export const antragslisteRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/router.component').then(m => m.RouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-antragsliste.component').then(m => m.DashboardAntragslisteComponent)
      },
      {
        path: 'feedback',
        loadComponent: () => import('./feedback/feedback.component').then(m => m.FeedbackComponent)
      }
    ]
  }
];

