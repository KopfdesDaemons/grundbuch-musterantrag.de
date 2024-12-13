import { Component, ViewEncapsulation, input } from '@angular/core';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
import { FooterComponent } from '../footer/footer.component';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ArtikelsidebarComponent } from '../artikelsidebar/artikelsidebar.component';
import { HeaderComponent } from '../header/header.component';
import { DisqusComponent } from "../disqus/disqus.component";

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [HeaderComponent, ArtikelsidebarComponent, FaIconComponent, RouterLink, FooterComponent, DisqusComponent]
})
export class ArtikelComponent {
  readonly nextSite = input<string>('');
  readonly title = input.required<string>();
  faPrint = faPrint;

  print() {
    window.print();
  }
}
