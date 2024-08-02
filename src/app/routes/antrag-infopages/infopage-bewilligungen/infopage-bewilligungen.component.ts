import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragAbschriftBewilligung } from 'src/app/models/antragAbschriftBewilligung';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';

@Component({
  selector: 'app-infopage-bewilligungen',
  templateUrl: './infopage-bewilligungen.component.html',
  styleUrl: './infopage-bewilligungen.component.scss'
})
export class InfopageBewilligungenComponent {
  antrag: Antrag = new AntragAbschriftBewilligung();

  constructor(private meta: Meta, private titleService: Title) {
    this.meta.updateTag({
      name: 'description',
      content: 'Download eines Musterantrags auf ' + this.antrag.title + ' als .pdf oder docx.'
    });
    this.titleService.setTitle('Kostenloser Musterantrag auf ' + this.antrag.title);
  }
}
