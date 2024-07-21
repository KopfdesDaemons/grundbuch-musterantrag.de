import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-erbnachweis',
  templateUrl: './erbnachweis.component.html',
  styleUrl: './erbnachweis.component.scss'
})

export class ErbnachweisComponent {

  constructor(public fs: FormService) { }
}
