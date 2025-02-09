import { Component, inject, OnInit } from '@angular/core';
import { DesignloaderService } from 'src/app/services/ui/designloader.service';
import { FormService } from 'src/app/services/document/form.service';
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
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  fs = inject(FormService);
  dl = inject(DesignloaderService);

  private routeParamsSubscription: Subscription | undefined;

  antragMapping: Record<string, new () => Antrag> = {
    'grundbuchausdruck': AntragGrundbuchausdruck,
    'namensberichtigung': AntragNamensberichtigung,
    'grundbuchberichtigung-sterbefall': AntragGrundbuchberichtigungSterbefall,
    'loeschung-abteilung2': AntragLoesschungAbt2,
    'abschrift-bewilligung': AntragAbschriftBewilligung,
    'teilungserklaerung': AntragTeilungserklaerung
  };

  ngOnInit(): void {
    this.routeParamsSubscription = this.route.params.subscribe((params) => {

      const antragArt: string = params['antragsart'];
      this.titleService.setTitle('Musterantrag ' + this.capitalizeFirstLetter(antragArt));

      const AntragClass = this.antragMapping[antragArt];
      if (AntragClass) {
        this.fs.init(new AntragClass());
      }
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
