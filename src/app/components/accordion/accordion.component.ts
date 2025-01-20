import { Component, ElementRef, input, viewChild } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [FaIconComponent]
})
export class AccordionComponent {
  faAngleDown = faAngleDown;

  readonly frage = input<string>('');
  readonly accordionhead = viewChild.required<ElementRef>('accordionhead');

  click() {
    const selectedElement = this.accordionhead().nativeElement;

    selectedElement.classList.toggle('FrageHeadAngeglickt');
    const Antwort = selectedElement.nextElementSibling;
    if (Antwort.style.maxHeight) Antwort.style.maxHeight = null;
    else Antwort.style.maxHeight = Antwort.scrollHeight + 'px';
  }
}
