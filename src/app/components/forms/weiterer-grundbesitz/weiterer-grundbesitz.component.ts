import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-weiterer-grundbesitz',
    templateUrl: './weiterer-grundbesitz.component.html',
    styleUrl: './weiterer-grundbesitz.component.scss',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class WeitererGrundbesitzComponent {

  constructor(public fs: FormService) { }

}
