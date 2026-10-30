import { Routes } from '@angular/router';

export const feedbackRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./router/router.component').then(m => m.RouterComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./feedback-overview/feedback-overview.component').then(m => m.FeedbackOverviewComponent)
      },
      {
        path: 'list',
        loadComponent: () => import('./feedback-list/feedback-list.component').then(m => m.FeedbackListComponent)
      }
    ]
  }
];

