import { Component, inject } from '@angular/core';
import { FormService } from 'src/app/services/document/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-farbe',
  templateUrl: './farbe.component.html',
  styleUrl: './farbe.component.scss',
  imports: [FormsModule, ReactiveFormsModule]
})
export class FarbeComponent {
  fs = inject(FormService);
}
