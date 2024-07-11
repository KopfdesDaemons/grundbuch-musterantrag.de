import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionComponent } from './components/accordion/accordion.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImpressumComponent } from './routes/impressum/impressum.component';
import { HomeComponent } from './routes/home/home.component';
import { DatenschutzComponent } from './routes/datenschutz/datenschutz.component';
import { EinleitungComponent } from './routes/grundbuchrecht/einleitung/einleitung.component';
import { ArtikelComponent } from './components/artikel/artikel.component';
import { ArtikelsidebarComponent } from './components/artikelsidebar/artikelsidebar.component';
import { BestandsverzeichnisComponent } from './routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component';
import { Abteilung1Component } from './routes/grundbuchrecht/abteilung1/abteilung1.component';
import { Abteilung2Component } from './routes/grundbuchrecht/abteilung2/abteilung2.component';
import { Abteilung3Component } from './routes/grundbuchrecht/abteilung3/abteilung3.component';
import { GrundbuchausdruckBeantragenComponent } from './routes/formulare/grundbuchausdruck-beantragen/grundbuchausdruck-beantragen.component';
import { AntragstellerComponent } from './components/forms/antragsteller/antragsteller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrundstueckComponent } from './components/forms/grundstueck/grundstueck.component';
import { BerechtigtesInteresseComponent } from './components/forms/berechtigtes-interesse/berechtigtes-interesse.component';
import { GrundbuchamtComponent } from './components/forms/grundbuchamt/grundbuchamt.component';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { AntragsgenerierungComponent } from "./components/forms/antragsgenerierung/antragsgenerierung.component";
import { FormDesAusdrucksComponent } from "./components/forms/form-des-ausdrucks/form-des-ausdrucks.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AccordionComponent,
        FooterComponent,
        ImpressumComponent,
        HomeComponent,
        DatenschutzComponent,
        EinleitungComponent,
        ArtikelComponent,
        ArtikelsidebarComponent,
        BestandsverzeichnisComponent,
        Abteilung1Component,
        Abteilung2Component,
        Abteilung3Component,
        GrundbuchausdruckBeantragenComponent,
        AntragstellerComponent,
        GrundstueckComponent,
        BerechtigtesInteresseComponent,
        GrundbuchamtComponent,
        ProgressSpinnerComponent,
        DashboardComponent,
        AntragsgenerierungComponent,
        FormDesAusdrucksComponent
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FontAwesomeModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        provideHttpClient(),
        provideClientHydration(),
    ],
})
export class AppModule { }
