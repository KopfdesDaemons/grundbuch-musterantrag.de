import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-antragsart-card',
    templateUrl: './antragsart-card.component.html',
    styleUrl: './antragsart-card.component.scss',
    imports: [RouterLink, NgClass]
})
export class AntragsartCardComponent {

  readonly antragsRoute = input<string>('');
  readonly title = input<string>('');
  readonly description = input<string>('');
  readonly mehrInfosRoute = input<string>('');
  readonly gebuehr = input<string>('');
  readonly erforderlicheUnterlagen = input<string[]>([]);
}
