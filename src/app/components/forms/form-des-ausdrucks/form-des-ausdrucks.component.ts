import { Component, inject } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-des-ausdrucks',
  templateUrl: './form-des-ausdrucks.component.html',
  styleUrl: './form-des-ausdrucks.component.scss',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule]
})
export class FormDesAusdrucksComponent {
  fs = inject(FormService);
}
