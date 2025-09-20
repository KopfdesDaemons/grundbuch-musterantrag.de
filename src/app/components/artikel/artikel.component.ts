import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DisqusComponent } from '../disqus/disqus.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, DisqusComponent]
})
export class ArtikelComponent {
  readonly nextSite = input<string>('');
  readonly title = input.required<string>();

  print() {
    window.print();
  }
}
