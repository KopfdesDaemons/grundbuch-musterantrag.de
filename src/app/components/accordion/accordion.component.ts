import { Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: []
})
export class AccordionComponent {
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
