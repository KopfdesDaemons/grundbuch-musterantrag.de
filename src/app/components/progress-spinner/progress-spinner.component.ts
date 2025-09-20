import { ChangeDetectionStrategy, Component, ElementRef, OnChanges, OnInit, input, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  imports: [NgClass]
})
export class ProgressSpinnerComponent implements OnChanges, OnInit {
  readonly circle = viewChild.required<ElementRef>('circle');
  readonly prozent = input<number>(100);
  readonly endless = input<boolean>(false);
  radius: number = 17;
  circumference: number = this.radius * 2 * Math.PI;

  ngOnInit(): void {
    this.circle().nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle().nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress();
  }

  ngOnChanges() {
    this.setProgress();
  }

  setProgress() {
    let percent = this.prozent();
    if (this.endless()) percent = 40;
    const offset = this.circumference - (percent / 100) * this.circumference;
    this.circle().nativeElement.style.strokeDashoffset = offset;
  }
}
