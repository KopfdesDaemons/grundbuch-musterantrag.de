import { Component } from '@angular/core';
import { Antrag } from 'src/app/interfaces/antrag';
import { AntragGrundbuchberichtigungSterbefall } from 'src/app/models/antragGrundbuchberichtigungSterbefall';

@Component({
  selector: 'app-infopage-sterbefall',
  templateUrl: './infopage-sterbefall.component.html',
  styleUrl: './infopage-sterbefall.component.scss'
})
export class InfopageSterbefallComponent {
  antrag: Antrag = new AntragGrundbuchberichtigungSterbefall();

}
