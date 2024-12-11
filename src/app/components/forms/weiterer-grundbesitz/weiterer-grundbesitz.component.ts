import { Component, inject } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-weiterer-grundbesitz',
    templateUrl: './weiterer-grundbesitz.component.html',
    styleUrl: './weiterer-grundbesitz.component.scss',
    imports: [FormsModule, ReactiveFormsModule]
})
export class WeitererGrundbesitzComponent {
  fs = inject(FormService);
}
