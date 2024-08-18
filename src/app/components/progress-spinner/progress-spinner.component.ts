import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-progress-spinner',
    templateUrl: './progress-spinner.component.html',
    styleUrls: ['./progress-spinner.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class ProgressSpinnerComponent implements OnChanges, AfterViewInit {

  @ViewChild('circle') circle!: ElementRef;
  @Input() prozent: number = 100;
  @Input() endless: boolean = false;
  radius!: number;
  circumference!: number;


  constructor(){
  }
  ngAfterViewInit(): void {
    this.radius = this.circle!.nativeElement.getAttribute('r');   
    this.circumference = this.radius * 2 * Math.PI;
    
    this.circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress(this.prozent);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prozent'] && this.circle) {
      const percent = parseInt(changes['prozent'].currentValue);
      this.setProgress(percent);
    }
    if(changes['endless'] && this.circle) {
      this.setProgress(40);
    }
  }

  setProgress(percent: number) {
  const offset = this.circumference - percent / 100 * this.circumference;
  this.circle.nativeElement.style.strokeDashoffset = offset;
  }
}
