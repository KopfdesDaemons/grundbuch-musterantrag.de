import { Routes } from '@angular/router';

export const grundbuchrechtRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./root/root.component').then(m => m.RootComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'einleitung'
      },
      {
        path: 'einleitung',
        loadComponent: () => import('./einleitung/einleitung.component').then(m => m.EinleitungComponent)
      },
      {
        path: 'bestandsverzeichnis',
        loadComponent: () => import('./bestandsverzeichnis/bestandsverzeichnis.component').then(m => m.BestandsverzeichnisComponent)
      },
      {
        path: 'abteilung1',
        loadComponent: () => import('./abteilung1/abteilung1.component').then(m => m.Abteilung1Component)
      },
      {
        path: 'abteilung2',
        loadComponent: () => import('./abteilung2/abteilung2.component').then(m => m.Abteilung2Component)
      },
      {
        path: 'abteilung3',
        loadComponent: () => import('./abteilung3/abteilung3.component').then(m => m.Abteilung3Component)
      }
    ]
  }
];
