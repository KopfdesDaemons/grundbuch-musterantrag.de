import { Component, inject } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-erbnachweis',
  templateUrl: './erbnachweis.component.html',
  styleUrl: './erbnachweis.component.scss',
  imports: [FormsModule, ReactiveFormsModule]
})

export class ErbnachweisComponent {
  fs = inject(FormService);
}
