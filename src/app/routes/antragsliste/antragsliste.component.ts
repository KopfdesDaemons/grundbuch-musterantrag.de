import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-antragsliste',
  templateUrl: './antragsliste.component.html',
  styleUrl: './antragsliste.component.scss'
})
export class AntragslisteComponent {

  antraege = [
    {
      title: "Antrag auf Erteilung eines Grundbuchausdrucks",
      antragsRoute: "/antrag/grundbuchausdruck",
      mehrInfosRoute: "/antraginfos/grundbuchausdruck",
      description: "Ihnen wird ein Ausdruck des kompletten Grundbuchs zugeschickt. Ein einfacher Grundbuchausdruck kostet 10,00 €",
      gebuehr: "mindestens 10,00 €",
      erforderlicheUnterlagen: ['Vollmacht, sofern Antragsteller nicht berechtigt ist']
    },
    {
      title: "Antrag auf Namensberichtigung einer natürlichen Person",
      antragsRoute: "/antrag/namensberichtigung",
      description: "Berichtigung des Namens, z.B. nach Eheschließung. Die Eheurkunde wird als Nachweis benötigt.",
      erforderlicheUnterlagen: ['beglaubigte Kopie der Eheurkunde oder vergleichbarer Nachweis über die Namensänderung']
    }
  ];

  constructor(meta: Meta, title: Title) {
    meta.updateTag({
      name: 'description',
      content: 'Generierung und Download als pdf oder docx. von Musteranträgen für das Grundbuchamt'
    });
    title.setTitle('Kostenlose Musteranträge für das Grundbuchamt');
  }
}
