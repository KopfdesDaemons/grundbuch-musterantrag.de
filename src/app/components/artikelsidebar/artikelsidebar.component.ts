import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  faSortDown,
  faBars
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-artikelsidebar',
  templateUrl: './artikelsidebar.component.html',
  styleUrls: ['./artikelsidebar.component.scss']
})
export class ArtikelsidebarComponent {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('sidebarbutton') sidebarbutton!: ElementRef;
  @ViewChild('closingdiv') closingdiv!: ElementRef;
  faSortDown = faSortDown;
  faBars = faBars;

  themen = [{
    name: 'Einleitung Grundbuchrecht', routerLink: '/grundbuchrecht/einleitung', unterthemen: [{ name: 'Definition Grundbuch', fragment: 'definitiongrundbuch' }, { name: 'Aufbau des Grundbuchs', fragment: 'aufbau' }, { name: 'Zuständigkeiten', fragment: 'zuständigkeiten' }, { name: 'Öffentlicher Glaube', fragment: 'öffentlicherglaube' }]
  },
  {
    name: 'Das Bestandsverzeichnis',
    routerLink: '/grundbuchrecht/bestandsverzeichnis',
    unterthemen: [
      { name: 'Defintion Grundstück', fragment: 'definitiongrundstück' },
      { name: 'Definition Flurstück', fragment: 'definitionflurstück' },
      { name: 'Definition Flur', fragment: 'definitionflur' },
      { name: 'Definition Gemarkung', fragment: 'definitiongemarkung' },
      { name: 'Liegenschaftskarte', fragment: 'liegenschaftskarte' },
      { name: 'Zerlegung', fragment: 'zerlegung' },
      { name: 'Verschmelzung', fragment: 'verschmelzung' },
      { name: 'Teilung', fragment: 'teilung' },
      { name: 'Vereinigung', fragment: 'vereinigung' }
    ]
  },
  {
    name: 'Abteilung I',
    routerLink: '/grundbuchrecht/abteilung1',
    unterthemen: [
      { name: 'Eigentumsarten', fragment: 'eigentumsarten' },
      { name: 'Grundstückserwerb', fragment: 'grundstückserwerb' }
    ]
  },
  {
    name: 'Abteilung II',
    routerLink: '/grundbuchrecht/abteilung2',
    unterthemen: [
      { name: 'Dauerwohnrecht', fragment: 'dauerwohnrecht' },
      { name: 'Dauernutzungsrecht', fragment: 'dauernutzungsrecht' },
      { name: 'Grunddienstbarkeiten', fragment: 'grunddienstbarkeit' },
      { name: 'beschränkte persönliche Dienstbarkeit', fragment: 'beschränktepersönlichedienstbarkeit' },
      { name: 'Nießbrauchrecht', fragment: 'nießbrauchrecht' },
      { name: 'Vorkaufsrecht', fragment: 'vorkaufsrecht' },
      { name: 'Reallasten', fragment: 'reallast' },
      { name: 'Altenteil', fragment: 'altenteil' },
      { name: 'Vormerkungen', fragment: 'vormerkung' },
      { name: 'Erbbaurecht', fragment: 'erbbaurecht' },
      { name: 'Nacherbenvermerk', fragment: 'nacherbenvermerk' },
      { name: 'Testamentsvollstreckervermerk', fragment: 'testamentsvollstreckervermerk' },
      { name: 'Zwangsversteigerungsvermerk', fragment: 'zwangsversteigerungsvermerk' },
      { name: 'Zwangsverwaltungsvermerk', fragment: 'zwangsverwaltungsvermerk' },
      { name: 'Insolvenzvermerk', fragment: 'insolvenzvermerk' },
      { name: 'Verfügungsbeschränkung nach der InSO', fragment: 'verfügungsbeschränkung' },
    ],
  },
  {
    name: 'Abteilung III',
    routerLink: '/grundbuchrecht/abteilung3',
    unterthemen: [
      { name: 'Grundschuld', fragment: 'grundschuld' },
      { name: 'Eigentümergrundschuld', fragment: 'eigentümergrundschuld' },
      { name: 'Rentenschuld', fragment: 'rentenschuld' },
      { name: 'Hypothek', fragment: 'hypothek' },
    ],
  },
  ];
  constructor(public router: Router) { }

  dropdown(event: Event): void {
    var element = event.target as Element;
    element.closest(".thema")!.classList.toggle("themaangeklickt");
  }

  open() {
    this.sidebar.nativeElement.classList.add("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "none";
    this.closingdiv.nativeElement.style.display = "block";
  }

  close() {
    this.sidebar.nativeElement.classList.remove("sidebaroffen");
    this.sidebarbutton.nativeElement.style.display = "flex";
    this.closingdiv.nativeElement.style.display = "none";
  }
}
