import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  imports: []
})
export class AccordionComponent {
  readonly title = input<string>('');
  readonly toggleElement = viewChild.required<ElementRef>('toggleElement');

  toggle() {
    const toggleElement = this.toggleElement().nativeElement;

    toggleElement.classList.toggle('open');
    const container = toggleElement.nextElementSibling;
    if (container.style.maxHeight) container.style.maxHeight = null;
    else container.style.maxHeight = container.scrollHeight + 'px';
  }
}
