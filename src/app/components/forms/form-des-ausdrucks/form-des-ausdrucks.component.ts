import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-form-des-ausdrucks',
  templateUrl: './form-des-ausdrucks.component.html',
  styleUrl: './form-des-ausdrucks.component.scss'
})
export class FormDesAusdrucksComponent {

  constructor(public fs: FormService) { }

}
