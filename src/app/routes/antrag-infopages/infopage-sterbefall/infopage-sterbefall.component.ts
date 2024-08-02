import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';

@Component({
  selector: 'app-infopage-sterbefall',
  templateUrl: './infopage-sterbefall.component.html',
  styleUrl: './infopage-sterbefall.component.scss'
})
export class InfopageSterbefallComponent {
  antrag: Antrag = new AntragGrundbuchberichtigungSterbefall();

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
