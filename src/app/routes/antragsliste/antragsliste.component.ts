import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';

@Component({
  selector: 'app-antragsliste',
  templateUrl: './antragsliste.component.html',
  styleUrl: './antragsliste.component.scss'
})
export class AntragslisteComponent {

  antraege: Antrag[] = [
    new AntragGrundbuchausdruck(),
    new AntragNamensberichtigung()
  ];

  constructor(meta: Meta, title: Title) {
    meta.updateTag({
      name: 'description',
      content: 'Generierung und Download als pdf oder docx. von Musteranträgen für das Grundbuchamt'
    });
    title.setTitle('Kostenlose Musteranträge für das Grundbuchamt');
  }
}
