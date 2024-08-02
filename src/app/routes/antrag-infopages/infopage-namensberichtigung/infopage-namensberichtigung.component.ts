import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragNamensberichtigung } from 'src/app/models/antragNamensberichtigung';

@Component({
  selector: 'app-infopage-namensberichtigung',
  templateUrl: './infopage-namensberichtigung.component.html',
  styleUrl: './infopage-namensberichtigung.component.scss'
})
export class InfopageNamensberichtigungComponent {
  antrag: Antrag = new AntragNamensberichtigung()

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
