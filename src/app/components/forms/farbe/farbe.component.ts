import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-farbe',
    templateUrl: './farbe.component.html',
    styleUrl: './farbe.component.scss',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})
export class FarbeComponent {

  constructor(public fs: FormService) { }

}
