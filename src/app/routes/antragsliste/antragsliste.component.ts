import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragAbschriftBewilligung } from 'src/app/models/antrag/abschrift-bewilligung.antrag.model';
import { AntragGrundbuchausdruck } from 'src/app/models/antrag/grundbuchausdruck.antrag.model';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antrag/grundbuchberichtigung-sterbefall.antrag.model';
import { AntragLoesschungAbt2 } from 'src/app/models/antrag/loeschung-abteilung-2.antrag.model';
import { AntragNamensberichtigung } from 'src/app/models/antrag/namensberichtigung.antrag.model';
import { AntragTeilungserklaerung } from 'src/app/models/antrag/teilungserklaerung.antrag.model';
import { FooterComponent } from '../../components/footer/footer.component';
import { AccordionComponent } from '../../components/accordion/accordion.component';
import { AntragsartCardComponent } from '../../components/antragsart-card/antragsart-card.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-antragsliste',
  templateUrl: './antragsliste.component.html',
  styleUrl: './antragsliste.component.scss',
  imports: [HeaderComponent, AntragsartCardComponent, AccordionComponent, FooterComponent]
})
export class AntragslisteComponent {

  antraege: Antrag[] = [
    new AntragGrundbuchausdruck(),
    new AntragNamensberichtigung(),
    new AntragGrundbuchberichtigungSterbefall(),
    new AntragLoesschungAbt2(),
    new AntragAbschriftBewilligung(),
    new AntragTeilungserklaerung
  ];

  constructor() {
    const meta = inject(Meta);
    const title = inject(Title);

    meta.updateTag({
      name: 'description',
      content: 'Generierung und Download von Musteranträgen für das Grundbuchamt als DOCX- oder PDF-Datei'
    });
    title.setTitle('Kostenlose Musteranträge für das Grundbuchamt');
  }
}
