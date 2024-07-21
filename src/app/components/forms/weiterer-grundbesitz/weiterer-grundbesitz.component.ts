import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';

@Component({
  selector: 'app-weiterer-grundbesitz',
  templateUrl: './weiterer-grundbesitz.component.html',
  styleUrl: './weiterer-grundbesitz.component.scss'
})
export class WeitererGrundbesitzComponent {

  constructor(public fs: FormService) { }

}
