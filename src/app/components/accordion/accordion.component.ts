import { Component, ElementRef, ViewChild, inject, input } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-accordion',
    templateUrl: './accordion.component.html',
    styleUrls: ['./accordion.component.scss'],
    imports: [NgClass, FaIconComponent]
})
export class AccordionComponent {
  // Injections
  dl = inject(DesignloaderService);

  // Fontawesome Icons
  faAngleDown = faAngleDown;

  readonly frage = input<string>('');
  @ViewChild('accordionhead') accordionhead!: ElementRef;

  click() {
    const selectedElement = this.accordionhead.nativeElement;

    selectedElement.classList.toggle('FrageHeadAngeglickt');
    var Antwort = selectedElement.nextElementSibling;
    if (Antwort.style.maxHeight) Antwort.style.maxHeight = null;
    else Antwort.style.maxHeight = Antwort.scrollHeight + 'px';
  }
}
