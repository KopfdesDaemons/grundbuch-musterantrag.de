import { Component, input } from '@angular/core';
import { Antrag } from 'src/app/interfaces/antrag';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-antragsinfos-hero',
  templateUrl: './antragsinfos-hero.component.html',
  styleUrl: './antragsinfos-hero.component.scss',
  imports: [RouterLink]
})
export class AntragsinfosHeroComponent {
  readonly antragsart = input.required<Antrag>();
}
