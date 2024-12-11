import { Component, inject, OnInit } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';
import { AntragAbschriftBewilligung } from 'src/app/models/antragAbschriftBewilligung';
import { AntragTeilungserklaerung } from 'src/app/models/antragTeilungserklaerung';
import { FileNotFoundComponent } from '../file-not-found/file-not-found.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { AntragsgenerierungComponent } from '../../components/forms/antragsgenerierung/antragsgenerierung.component';
import { HinweisComponent } from '../../components/forms/hinweis/hinweis.component';
import { GrundbuchamtComponent } from '../../components/forms/grundbuchamt/grundbuchamt.component';
import { BerechtigtesInteresseComponent } from '../../components/forms/berechtigtes-interesse/berechtigtes-interesse.component';
import { FormDesAusdrucksComponent } from '../../components/forms/form-des-ausdrucks/form-des-ausdrucks.component';
import { WeitererGrundbesitzComponent } from '../../components/forms/weiterer-grundbesitz/weiterer-grundbesitz.component';
import { BewilligungComponent } from '../../components/forms/bewilligung/bewilligung.component';
import { FarbeComponent } from '../../components/forms/farbe/farbe.component';
import { TeilungserklaerungComponent } from '../../components/forms/teilungserklaerung/teilungserklaerung.component';
import { ErbnachweisComponent } from '../../components/forms/erbnachweis/erbnachweis.component';
import { RechtAbteilung2Component } from '../../components/forms/recht-abteilung2/recht-abteilung2.component';
import { GrundstueckComponent } from '../../components/forms/grundstueck/grundstueck.component';
import { ErblasserComponent } from '../../components/forms/erblasser/erblasser.component';
import { AntragstellerComponent } from '../../components/forms/antragsteller/antragsteller.component';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-antragsformular',
    templateUrl: './antragsformular.component.html',
    styleUrls: ['./antragsformular.component.scss'],
    imports: [HeaderComponent, NgClass, AntragstellerComponent, ErblasserComponent, GrundstueckComponent, RechtAbteilung2Component, ErbnachweisComponent, TeilungserklaerungComponent, FarbeComponent, BewilligungComponent, WeitererGrundbesitzComponent, FormDesAusdrucksComponent, BerechtigtesInteresseComponent, GrundbuchamtComponent, HinweisComponent, AntragsgenerierungComponent, FooterComponent, FileNotFoundComponent]
})
export class AntragsformularComponent implements OnInit {
  // Injections
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  fs = inject(FormService);
  dl = inject(DesignloaderService);

  private routeParamsSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe(async (params) => {

      const antragArt: string = params['antragsart'];
      this.titleService.setTitle('Musterantrag ' + this.capitalizeFirstLetter(antragArt));

      let antrag: Antrag | null = null;
      switch (antragArt) {
        case 'grundbuchausdruck': {
          antrag = new AntragGrundbuchausdruck();
          break;
        }
        case 'namensberichtigung': {
          antrag = new AntragNamensberichtigung();
          break;
        }
        case 'grundbuchberichtigung-sterbefall': {
          antrag = new AntragGrundbuchberichtigungSterbefall();
          break;
        }
        case 'loeschung-abteilung2': {
          antrag = new AntragLoesschungAbt2();
          break;
        }
        case 'abschrift-bewilligung': {
          antrag = new AntragAbschriftBewilligung();
          break;
        }
        case 'teilungserklaerung': {
          antrag = new AntragTeilungserklaerung();
          break;
        }
      }
      if (antrag) this.fs.init(antrag);
    })
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
