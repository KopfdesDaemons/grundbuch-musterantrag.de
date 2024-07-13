import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-antragsart-card',
  templateUrl: './antragsart-card.component.html',
  styleUrl: './antragsart-card.component.scss'
})
export class AntragsartCardComponent {

  @Input() antragsRoute: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() mehrInfosRoute: string = ''
  @Input() gebuehr: string = ''
}
