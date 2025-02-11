import { Component, inject, OnInit } from '@angular/core';
import { FormService } from 'src/app/services/document/form.service';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antrag/grundbuchausdruck.antrag.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragNamensberichtigung } from 'src/app/models/antrag/namensberichtigung.antrag.model';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antrag/grundbuchberichtigung-sterbefall.antrag.model';
import { AntragLoesschungAbt2 } from 'src/app/models/antrag/loeschung-abteilung-2.antrag.model';
import { AntragAbschriftBewilligung } from 'src/app/models/antrag/abschrift-bewilligung.antrag.model';
import { AntragTeilungserklaerung } from 'src/app/models/antrag/teilungserklaerung.antrag.model';
import { FileNotFoundComponent } from '../file-not-found/file-not-found.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NgComponentOutlet } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-antragsformular',
  templateUrl: './antragsformular.component.html',
  styleUrls: ['./antragsformular.component.scss'],
  imports: [HeaderComponent, NgComponentOutlet, FooterComponent, FileNotFoundComponent]
})
export class AntragsformularComponent implements OnInit {
  private titleService = inject(Title);
  private route = inject(ActivatedRoute);
  fs = inject(FormService);

  private routeParamsSubscription: Subscription | undefined;

  private antragMapping: Record<string, new () => Antrag> = {
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

      const AntragClass = this.antragMapping[antragArt];
      if (AntragClass) {
        this.fs.init(new AntragClass());
      }
      this.titleService.setTitle('Musterantrag ' + this.fs.antrag?.title);
    })
  }

  ngOnDestroy(): void {
    if (this.routeParamsSubscription) {
      this.routeParamsSubscription.unsubscribe();
    }
  }
}
