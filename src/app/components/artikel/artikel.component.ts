import { Component, Input, ViewEncapsulation } from '@angular/core';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-artikel',
  templateUrl: './artikel.component.html',
  styleUrls: ['./artikel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ArtikelComponent {
  @Input() nextSite: string = '';
  faPrint = faPrint;

  print(){
    window.print();
  }
}
