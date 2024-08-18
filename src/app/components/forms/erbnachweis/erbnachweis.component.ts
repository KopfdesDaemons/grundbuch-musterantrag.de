import { Component } from '@angular/core';
import { FormService } from 'src/app/services/form.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-erbnachweis',
    templateUrl: './erbnachweis.component.html',
    styleUrl: './erbnachweis.component.scss',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule]
})

export class ErbnachweisComponent {

  constructor(public fs: FormService) { }
}
