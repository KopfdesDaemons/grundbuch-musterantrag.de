import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-teilungserklaerung',
  templateUrl: './teilungserklaerung.component.html',
  styleUrl: './teilungserklaerung.component.scss',
  imports: [FormsModule, ReactiveFormsModule]
})
export class TeilungserklaerungComponent {
  form: FormGroup;
  fs = inject(FormService);

  constructor() {
    this.form = this.fs.form.get('teilungserklaerung') as FormGroup;
  }
}
