import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-farbe',
  templateUrl: './farbe.component.html',
  styleUrl: './farbe.component.scss'
})
export class FarbeComponent {

  constructor(public fs: FormService) { }

}
