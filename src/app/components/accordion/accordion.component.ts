import { Component, ElementRef, input, viewChild } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: [FaIconComponent],
})
export class AccordionComponent {
  faAngleDown = faAngleDown;

  readonly frage = input<string>('');
  readonly toggle = viewChild.required<ElementRef>('toggle');

  click() {
    const toggleElement = this.toggle().nativeElement;

    toggleElement.classList.toggle('open');
    const container = toggleElement.nextElementSibling;
    if (container.style.maxHeight) container.style.maxHeight = null;
    else container.style.maxHeight = container.scrollHeight + 'px';
  }
}
