import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, input, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-progress-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    imports: [NgClass]
})
export class ProgressSpinnerComponent implements OnChanges, AfterViewInit {

  readonly circle = viewChild.required<ElementRef>('circle');
  readonly prozent = input<number>(100);
  readonly endless = input<boolean>(false);
  radius!: number;
  circumference!: number;

  ngAfterViewInit(): void {
    this.radius = this.circle()!.nativeElement.getAttribute('r');
    this.circumference = this.radius * 2 * Math.PI;

    const circle = this.circle();
    circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress(this.prozent());
    if (this.endless()) {
      this.setProgress(40);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    const circle = this.circle();
    if (changes['prozent'] && circle) {
      const percent = parseInt(changes['prozent'].currentValue);
      this.setProgress(percent);
    }
    if (changes['endless'] && circle) {
      this.setProgress(40);
    }
  }

  setProgress(percent: number) {
    const offset = this.circumference - percent / 100 * this.circumference;
    this.circle().nativeElement.style.strokeDashoffset = offset;
  }
}
