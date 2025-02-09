import { Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

export const dashboardRoutes: Routes = [{
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
        {
            path: '',
            loadComponent: () => import('./dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent),
            canActivate: [AuthGuard]
        },
        {
            path: 'user-settings', loadComponent: () => import('./user-settings/user-settings.component').then(m => m.UserSettingsComponent),
            canActivate: [AuthGuard]
        },
        {
            path: 'antragsliste', loadComponent: () => import('./dashboard-antragsliste/dashboard-antragsliste.component').then(m => m.DashboardAntragslisteComponent),
            canActivate: [AuthGuard]
        },
        {
            path: 'users',
            loadChildren: () => import('./users/users.routes').then(m => m.usersRoutes)
        },
        {
            path: 'statistic', loadComponent: () => import('./statistic/statistic.component').then(m => m.StatisticComponent),
            canActivate: [AuthGuard]
        },
    ]
}]