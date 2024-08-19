import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: "", loadComponent: () => import('./routes/antragsliste/antragsliste.component').then(m => m.AntragslisteComponent) },
    { path: 'antrag/:antragsart', loadComponent: () => import('./routes/antragsformular/antragsformular.component').then(m => m.AntragsformularComponent) },

    {
        path: 'antragsinfos',
        children: [
            { path: 'grundbuchausdruck', loadComponent: () => import('./routes/antrag-infopages/infopage-grundbuchausdruck/infopage-grundbuchausdruck.component').then(m => m.InfopageGrundbuchausdruckComponent) },
            { path: 'namensberichtigung', loadComponent: () => import('./routes/antrag-infopages/infopage-namensberichtigung/infopage-namensberichtigung.component').then(m => m.InfopageNamensberichtigungComponent) },
            { path: 'sterbefall', loadComponent: () => import('./routes/antrag-infopages/infopage-sterbefall/infopage-sterbefall.component').then(m => m.InfopageSterbefallComponent) },
            { path: 'bewilligungen', loadComponent: () => import('./routes/antrag-infopages/infopage-bewilligungen/infopage-bewilligungen.component').then(m => m.InfopageBewilligungenComponent) },
            { path: 'teilungserklaerung', loadComponent: () => import('./routes/antrag-infopages/infopage-teilungserklaerung/infopage-teilungserklaerung.component').then(m => m.InfopageTeilungserklaerungComponent) },
            { path: 'loeschung-abteilung2', loadComponent: () => import('./routes/antrag-infopages/infopage-loeschung-abteilung2/infopage-loeschung-abteilung2.component').then(m => m.InfopageLoeschungAbteilung2Component) }
        ]
    },

    {
        path: 'grundbuchrecht',
        children: [
            { path: 'einleitung', loadComponent: () => import('./routes/grundbuchrecht/einleitung/einleitung.component').then(m => m.EinleitungComponent) },
            { path: 'bestandsverzeichnis', loadComponent: () => import('./routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component').then(m => m.BestandsverzeichnisComponent) },
            { path: 'abteilung1', loadComponent: () => import('./routes/grundbuchrecht/abteilung1/abteilung1.component').then(m => m.Abteilung1Component) },
            { path: 'abteilung2', loadComponent: () => import('./routes/grundbuchrecht/abteilung2/abteilung2.component').then(m => m.Abteilung2Component) },
            { path: 'abteilung3', loadComponent: () => import('./routes/grundbuchrecht/abteilung3/abteilung3.component').then(m => m.Abteilung3Component) }
        ]
    },

    { path: 'impressum', loadComponent: () => import('./routes/impressum/impressum.component').then(m => m.ImpressumComponent) },
    { path: 'datenschutz', loadComponent: () => import('./routes/datenschutz/datenschutz.component').then(m => m.DatenschutzComponent) },
    {
        path: 'dashboard'
        , children: [
            { path: '', loadComponent: () => import('./routes/dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent) },
            { path: 'antragsliste', loadComponent: () => import('./routes/dashboard/dashboard-antragsliste/dashboard-antragsliste.component').then(m => m.DashboardAntragslisteComponent) },
        ]
    },
    { path: 'login', loadComponent: () => import('./routes/login/login.component').then(m => m.LoginComponent) },
    { path: '**', loadComponent: () => import('./routes/file-not-found/file-not-found.component').then(m => m.FileNotFoundComponent) }
];
