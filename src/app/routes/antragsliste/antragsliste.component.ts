import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';
import { AntragLoesschungAbt2 } from 'src/app/models/antragLoeschungAbt2';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';

@Component({
  selector: 'app-antragsliste',
  templateUrl: './antragsliste.component.html',
  styleUrl: './antragsliste.component.scss'
})
export class AntragslisteComponent {

  antraege: Antrag[] = [
    new AntragGrundbuchausdruck(),
    new AntragNamensberichtigung(),
    new AntragGrundbuchberichtigungSterbefall(),
    new AntragLoesschungAbt2()
  ];

  constructor(meta: Meta, title: Title) {
    meta.updateTag({
      name: 'description',
      content: 'Generierung und Download als pdf oder docx. von Musteranträgen für das Grundbuchamt'
    });
    title.setTitle('Kostenlose Musteranträge für das Grundbuchamt');
  }
}
