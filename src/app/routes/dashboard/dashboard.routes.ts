import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    title: 'Dashboard',
    children: [
      {
        path: '',
        loadComponent: () => import('./dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent)
      },
      {
        path: 'user-settings',
        loadComponent: () => import('./user-settings/user-settings.component').then(m => m.UserSettingsComponent)
      },
      {
        path: 'antragsliste',
        loadComponent: () => import('./dashboard-antragsliste/dashboard-antragsliste.component').then(m => m.DashboardAntragslisteComponent)
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.usersRoutes)
      },
      {
        path: 'statistic',
        loadComponent: () => import('./statistic/statistic.component').then(m => m.StatisticComponent)
      },
      {
        path: 'logs',
        loadComponent: () => import('./logs-list/logs-list.component').then(m => m.LogsListComponent)
      }
    ]
  }
];
