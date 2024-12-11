import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-antragsart-card',
    templateUrl: './antragsart-card.component.html',
    styleUrl: './antragsart-card.component.scss',
    imports: [RouterLink, NgClass]
})
export class AntragsartCardComponent {

  @Input() antragsRoute: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() mehrInfosRoute: string = '';
  @Input() gebuehr: string = '';
  @Input() erforderlicheUnterlagen: string[] = [];
}
