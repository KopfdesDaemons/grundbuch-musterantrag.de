import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnChanges, AfterViewInit {

  @ViewChild('circle') circle!: ElementRef;
  @Input() prozent: string = '100';
  radius!: number;
  circumference!: number;


  constructor(){
  }
  ngAfterViewInit(): void {
    this.radius = this.circle!.nativeElement.getAttribute('r');   
    this.circumference = this.radius * 2 * Math.PI;
    
    this.circle.nativeElement.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
    this.circle.nativeElement.style.strokeDashoffset = `${this.circumference}`;
    this.setProgress(parseInt(this.prozent));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['prozent'] && this.circle) {
      const percent = parseInt(changes['prozent'].currentValue);
      this.setProgress(percent);
    }
  }

  setProgress(percent: number) {
  const offset = this.circumference - percent / 100 * this.circumference;
  this.circle.nativeElement.style.strokeDashoffset = offset;
  }
}
