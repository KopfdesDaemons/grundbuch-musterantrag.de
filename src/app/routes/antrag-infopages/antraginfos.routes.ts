import { Routes } from "@angular/router";

export const antraginfosRoutes: Routes = [{
    path: '',
    children: [
        {
            path: '',
            pathMatch: 'full',
            redirectTo: '/',
        },
        {
            path: 'grundbuchausdruck',
            loadComponent: () => import('./infopage-grundbuchausdruck/infopage-grundbuchausdruck.component').then(m => m.InfopageGrundbuchausdruckComponent)
        },
        {
            path: 'namensberichtigung', loadComponent: () => import('./infopage-namensberichtigung/infopage-namensberichtigung.component').then(m => m.InfopageNamensberichtigungComponent)
        },
        {
            path: 'sterbefall', loadComponent: () => import('./infopage-sterbefall/infopage-sterbefall.component').then(m => m.InfopageSterbefallComponent)
        },
        {
            path: 'bewilligungen', loadComponent: () => import('./infopage-bewilligungen/infopage-bewilligungen.component').then(m => m.InfopageBewilligungenComponent)
        },
        {
            path: 'teilungserklaerung', loadComponent: () => import('./infopage-teilungserklaerung/infopage-teilungserklaerung.component').then(m => m.InfopageTeilungserklaerungComponent)
        },
        {
            path: 'loeschung-abteilung2', loadComponent: () => import('./infopage-loeschung-abteilung2/infopage-loeschung-abteilung2.component').then(m => m.InfopageLoeschungAbteilung2Component)
        }
    ]
}]