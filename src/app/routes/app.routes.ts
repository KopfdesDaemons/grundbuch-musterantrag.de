import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {
        path: "",
        loadComponent: () => import('./antragsliste/antragsliste.component').then(m => m.AntragslisteComponent)
    },
    {
        path: 'antrag/:antragsart',
        loadComponent: () => import('./antragsformular/antragsformular.component').then(m => m.AntragsformularComponent)
    },
    {
        path: 'antragsinfos',
        loadChildren: () => import('./antrag-infopages/antraginfos.routes').then(m => m.antraginfosRoutes)
    },
    {
        path: 'grundbuchrecht',
        loadChildren: () => import('./grundbuchrecht/grundbuchrecht.routes').then(m => m.grundbuchrechtRoutes)
    },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.routes').then(m => m.dashboardRoutes),
        canActivate: [AuthGuard]
    },
    {
        path: 'impressum',
        loadComponent: () => import('./impressum/impressum.component').then(m => m.ImpressumComponent)
    },
    {
        path: 'datenschutz',
        loadComponent: () => import('./datenschutz/datenschutz.component').then(m => m.DatenschutzComponent)
    },
    {
        path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
    },
    {
        path: 'new-password', loadComponent: () => import('./new-password/new-password.component').then(m => m.NewPasswordComponent)
    },
    {
        path: '**', loadComponent: () => import('./file-not-found/file-not-found.component').then(m => m.FileNotFoundComponent)
    }
];
