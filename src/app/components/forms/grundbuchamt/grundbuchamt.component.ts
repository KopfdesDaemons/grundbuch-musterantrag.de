import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grundbuchamt',
  templateUrl: './grundbuchamt.component.html',
  styleUrls: ['./grundbuchamt.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class GrundbuchamtComponent {
  fs = inject(FormService);
  form: FormGroup;
  orte = signal<string[]>([]);
  ortDropdownOpen = signal(false);
  activeOrtIndex = signal(-1);

  constructor() {
    this.form = this.fs.form.get('grundbuchamt') as FormGroup;
    const initialPlz = this.form.get('plz')?.value;
    if (initialPlz?.length === 5) {
      void this.fs.ortAusPLZ(initialPlz).then(orte => this.orte.set(orte));
    }
  }

  async suchePlz(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value.length === 5) {
      const orte = await this.fs.ortAusPLZ(value);
      this.orte.set(orte);
      this.activeOrtIndex.set(-1);
      if (orte.length === 1) {
        this.form.controls['ort'].setValue(orte[0]);
        this.ortDropdownOpen.set(false);
      } else if (orte.length > 1) {
        if (!orte.includes(this.form.controls['ort'].value)) {
          this.form.controls['ort'].setValue('');
        }
        if (document.activeElement === input || document.activeElement?.id === 'ortamtsgerichtinput') {
          this.ortDropdownOpen.set(true);
        }
      } else {
        this.form.controls['ort'].setValue('');
        this.ortDropdownOpen.set(false);
      }
    } else {
      this.orte.set([]);
      this.ortDropdownOpen.set(false);
      this.activeOrtIndex.set(-1);
    }
  }

  onOrtKeydown(event: KeyboardEvent) {
    const list = this.orte();
    if (list.length <= 1) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.ortDropdownOpen.set(true);
      this.activeOrtIndex.update(i => (i + 1) % list.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.ortDropdownOpen.set(true);
      this.activeOrtIndex.update(i => (i <= 0 ? list.length - 1 : i - 1));
    } else if (event.key === 'Enter' && this.ortDropdownOpen() && this.activeOrtIndex() >= 0) {
      event.preventDefault();
      this.selectOrt(list[this.activeOrtIndex()]);
    } else if (event.key === 'Escape' && this.ortDropdownOpen()) {
      event.preventDefault();
      this.ortDropdownOpen.set(false);
      this.activeOrtIndex.set(-1);
    }
  }

  selectOrt(ort: string) {
    this.form.controls['ort'].setValue(ort);
    this.ortDropdownOpen.set(false);
    this.activeOrtIndex.set(-1);
  }

  onlineSuchen() {
    const grundstueckForm = this.fs.form.get('grundstueck') as FormGroup;
    const plz = encodeURIComponent(grundstueckForm.get('plz')?.value || '');
    const ort = encodeURIComponent(grundstueckForm.get('ort')?.value || '');
    window.open(`https://www.justizadressen.nrw.de/de/justiz/gericht?ang=grundbuch&plz=${plz}&ort=${ort}`);
  }

  addAmtsgericht() {
    const name = (this.fs.form.get('grundbuchamt') as FormGroup).get('name')?.value;
    this.form.controls['name'].setValue('Amtsgericht ' + name.trim());
  }
}
