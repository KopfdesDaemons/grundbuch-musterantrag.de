import {
  AfterViewInit,
  Component,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { DesignloaderService } from 'src/app/services/designloader.service';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
})
export class AccordionComponent {
  faAngleDown = faAngleDown;
  
  @Input() frage: string = '';
  @ViewChild('accordionhead') accordionhead!: ElementRef;

  constructor(public dl:DesignloaderService){}

  click() {
    const selectedElement = this.accordionhead.nativeElement;

    selectedElement.classList.toggle('FrageHeadAngeglickt');
    var Antwort = selectedElement.nextElementSibling;
    if (Antwort.style.maxHeight) Antwort.style.maxHeight = null;
    else Antwort.style.maxHeight = Antwort.scrollHeight + 'px';
  }
}
