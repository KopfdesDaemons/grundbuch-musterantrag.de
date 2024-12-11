import { AfterViewInit, Component, ElementRef, OnChanges, SimpleChanges, ViewChild, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-progress-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    imports: [NgClass]
})
export class ProgressSpinnerComponent implements OnChanges, AfterViewInit {

  @ViewChild('circle') circle!: ElementRef;
  readonly prozent = input<number>(100);
  readonly endless = input<boolean>(false);
  radius!: number;
  circumference!: number;

  ngAfterViewInit(): void {
    this.radius = this.circle!.nativeElement.getAttribute('r');
    this.circumference = this.radius * 2 * Math.PI;

    this.circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress(this.prozent());
    if (this.endless()) {
      this.setProgress(40);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prozent'] && this.circle) {
      const percent = parseInt(changes['prozent'].currentValue);
      this.setProgress(percent);
    }
    if (changes['endless'] && this.circle) {
      this.setProgress(40);
    }
  }

  setProgress(percent: number) {
    const offset = this.circumference - percent / 100 * this.circumference;
    this.circle.nativeElement.style.strokeDashoffset = offset;
  }
}
