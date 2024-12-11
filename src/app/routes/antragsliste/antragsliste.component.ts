import { Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragAbschriftBewilligung } from 'src/app/models/antragAbschriftBewilligung';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';
import { AntragTeilungserklaerung } from 'src/app/models/antragTeilungserklaerung';
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
      content: 'Generierung und Download als pdf oder docx. von Musteranträgen für das Grundbuchamt'
    });
    title.setTitle('Kostenlose Musteranträge für das Grundbuchamt');
  }
}
