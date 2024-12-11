import { Component, input } from '@angular/core';
import { faFilePdf, faPrint, faDownload } from '@fortawesome/free-solid-svg-icons';
import { Antrag } from 'src/app/interfaces/antrag';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-antragsinfos-hero',
    templateUrl: './antragsinfos-hero.component.html',
    styleUrl: './antragsinfos-hero.component.scss',
    imports: [RouterLink, FaIconComponent]
})
export class AntragsinfosHeroComponent {
  faFilePdf = faFilePdf;
  faPrint = faPrint;
  faDownload = faDownload;

  readonly antragsart = input.required<Antrag>();
}
