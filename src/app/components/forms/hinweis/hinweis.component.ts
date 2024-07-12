import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-hinweis',
  templateUrl: './hinweis.component.html',
  styleUrl: './hinweis.component.scss'
})
export class HinweisComponent {
  index: number = 0;
  hinweise: string[] = [];
  hinweis: string = '';

  constructor(private fs: FormService) {
    if (!fs.antrag?.hinweise) return;
    this.hinweise = fs.antrag.hinweise;
    this.hinweis = this.hinweise[this.index];
  }

  next() {
    if (this.hinweise.length > 0) {
      this.index++;
      if (this.index < this.hinweise.length) {
        this.hinweis = this.hinweise[this.index];
      } else {
        this.fs.nextStep();
      }
    }
  }

  back() {
    if (this.index > 0) {
      this.index--;
      this.hinweis = this.hinweise[this.index];
    } else {
      console.log('index nicht größer 0 ' + this.index);
      this.fs.stepback();
    }
  }
}
