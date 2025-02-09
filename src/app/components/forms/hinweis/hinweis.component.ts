import { Component, inject } from '@angular/core';
import { FormService } from 'src/app/services/document/form.service';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-hinweis',
  templateUrl: './hinweis.component.html',
  styleUrl: './hinweis.component.scss',
  imports: [FaIconComponent]
})
export class HinweisComponent {
  fs = inject(FormService);

  faCircleInfo = faCircleInfo;

  index: number = 0;
  hinweise: string[] = [];
  hinweis: string = '';

  constructor() {
    if (!this.fs.antrag?.hinweise) return;
    this.hinweise = this.fs.antrag.hinweise;
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
      this.fs.stepback();
    }
  }
}
