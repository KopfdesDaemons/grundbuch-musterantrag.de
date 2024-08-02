import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccordionComponent } from './components/accordion/accordion.component';
import { FooterComponent } from './components/footer/footer.component';
import { ImpressumComponent } from './routes/impressum/impressum.component';
import { InfopageGrundbuchausdruckComponent } from './routes/antrag-infopages/infopage-grundbuchausdruck/infopage-grundbuchausdruck.component';
import { DatenschutzComponent } from './routes/datenschutz/datenschutz.component';
import { EinleitungComponent } from './routes/grundbuchrecht/einleitung/einleitung.component';
import { ArtikelComponent } from './components/artikel/artikel.component';
import { ArtikelsidebarComponent } from './components/artikelsidebar/artikelsidebar.component';
import { BestandsverzeichnisComponent } from './routes/grundbuchrecht/bestandsverzeichnis/bestandsverzeichnis.component';
import { Abteilung1Component } from './routes/grundbuchrecht/abteilung1/abteilung1.component';
import { Abteilung2Component } from './routes/grundbuchrecht/abteilung2/abteilung2.component';
import { Abteilung3Component } from './routes/grundbuchrecht/abteilung3/abteilung3.component';
import { AntragsformularComponent } from './routes/antragsformular/antragsformular.component';
import { AntragstellerComponent } from './components/forms/antragsteller/antragsteller.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GrundstueckComponent } from './components/forms/grundstueck/grundstueck.component';
import { BerechtigtesInteresseComponent } from './components/forms/berechtigtes-interesse/berechtigtes-interesse.component';
import { GrundbuchamtComponent } from './components/forms/grundbuchamt/grundbuchamt.component';
import { provideHttpClient } from '@angular/common/http';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { AntragsgenerierungComponent } from "./components/forms/antragsgenerierung/antragsgenerierung.component";
import { FormDesAusdrucksComponent } from "./components/forms/form-des-ausdrucks/form-des-ausdrucks.component";
import { HinweisComponent } from './components/forms/hinweis/hinweis.component';
import { AntragslisteComponent } from './routes/antragsliste/antragsliste.component';
import { AntragsartCardComponent } from "./components/antragsart-card/antragsart-card.component";
import { FileNotFoundComponent } from './routes/file-not-found/file-not-found.component';
import { ErblasserComponent } from './components/forms/erblasser/erblasser.component';
import { ErbnachweisComponent } from './components/forms/erbnachweis/erbnachweis.component';
import { WeitererGrundbesitzComponent } from './components/forms/weiterer-grundbesitz/weiterer-grundbesitz.component';
import { RechtAbteilung2Component } from './components/forms/recht-abteilung2/recht-abteilung2.component';
import { FarbeComponent } from './components/forms/farbe/farbe.component';
import { BewilligungComponent } from './components/forms/bewilligung/bewilligung.component';
import { TeilungserklaerungComponent } from './components/forms/teilungserklaerung/teilungserklaerung.component';
import { InfopageNamensberichtigungComponent } from './routes/antrag-infopages/infopage-namensberichtigung/infopage-namensberichtigung.component';
import { SachlicheUndOrtlicheZustaendigkeitComponent } from './components/sachliche-und-ortliche-zustaendigkeit/sachliche-und-ortliche-zustaendigkeit.component';
import { AntragsinfosHeroComponent } from './components/antragsinfos-hero/antragsinfos-hero.component';
import { InfopageSterbefallComponent } from './routes/antrag-infopages/infopage-sterbefall/infopage-sterbefall.component';
import { InfopageBewilligungenComponent } from './routes/antrag-infopages/infopage-bewilligungen/infopage-bewilligungen.component';
import { InfopageTeilungserklaerungComponent } from './routes/antrag-infopages/infopage-teilungserklaerung/infopage-teilungserklaerung.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        AccordionComponent,
        FooterComponent,
        ImpressumComponent,
        InfopageGrundbuchausdruckComponent,
        DatenschutzComponent,
        EinleitungComponent,
        ArtikelComponent,
        ArtikelsidebarComponent,
        BestandsverzeichnisComponent,
        Abteilung1Component,
        Abteilung2Component,
        Abteilung3Component,
        AntragsformularComponent,
        AntragstellerComponent,
        GrundstueckComponent,
        BerechtigtesInteresseComponent,
        GrundbuchamtComponent,
        ProgressSpinnerComponent,
        DashboardComponent,
        AntragsgenerierungComponent,
        FormDesAusdrucksComponent,
        HinweisComponent,
        AntragslisteComponent,
        AntragsartCardComponent,
        FileNotFoundComponent,
        ErblasserComponent,
        ErbnachweisComponent,
        WeitererGrundbesitzComponent,
        RechtAbteilung2Component,
        FarbeComponent,
        BewilligungComponent,
        TeilungserklaerungComponent,
        InfopageNamensberichtigungComponent,
        SachlicheUndOrtlicheZustaendigkeitComponent,
        AntragsinfosHeroComponent,
        InfopageSterbefallComponent,
        InfopageBewilligungenComponent,
        InfopageTeilungserklaerungComponent
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
