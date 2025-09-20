import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DesignloaderService } from 'src/app/services/ui/designloader.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly imagePath = input<string>('/images/kaufvertrag.avif');
  readonly designS = inject(DesignloaderService);
}
