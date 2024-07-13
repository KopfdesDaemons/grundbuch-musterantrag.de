import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatenschutzComponent } from './routes/datenschutz/datenschutz.component';
import { AntragsformularComponent } from './routes/antragsformular/antragsformular.component';
import { Abteilung1Component } from './routes/grundbuchrecht/abteilung1/abteilung1.component';
import { Abteilung2Component } from './routes/grundbuchrecht/abteilung2/abteilung2.component';
import { Abteilung3Component } from './routes/grundbuchrecht/abteilung3/abteilung3.component';
import { BestandsverzeichnisComponent } from './routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component';
import { EinleitungComponent } from './routes/grundbuchrecht/einleitung/einleitung.component';
import { InfopageGrundbuchausdruckComponent } from './routes/antrag-infopages/infopage-grundbuchausdruck/infopage-grundbuchausdruck.component';
import { ImpressumComponent } from './routes/impressum/impressum.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AntragslisteComponent } from './routes/antragsliste/antragsliste.component';
import { FileNotFoundComponent } from './routes/file-not-found/file-not-found.component';

const routes: Routes = [
  { path: "", component: AntragslisteComponent },
  { path: 'antrag/:antragsart', component: AntragsformularComponent },
  { path: 'antraginfos/grundbuchausdruck', component: InfopageGrundbuchausdruckComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: 'grundbuchrecht/einleitung', component: EinleitungComponent },
  { path: 'grundbuchrecht/bestandsverzeichnis', component: BestandsverzeichnisComponent },
  { path: 'grundbuchrecht/abteilung1', component: Abteilung1Component },
  { path: 'grundbuchrecht/abteilung2', component: Abteilung2Component },
  { path: 'grundbuchrecht/abteilung3', component: Abteilung3Component },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', component: FileNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
