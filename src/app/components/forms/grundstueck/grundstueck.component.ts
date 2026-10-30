import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Antrag } from 'src/app/interfaces/antrag';
import { FormService } from 'src/app/services/document/form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grundstueck',
  templateUrl: './grundstueck.component.html',
  styleUrls: ['./grundstueck.component.scss'],
  imports: [FormsModule, ReactiveFormsModule]
})
export class GrundstueckComponent {
  fs = inject(FormService);
  form: FormGroup;
  orte = signal<string[]>([]);
  ortDropdownOpen = signal(false);
  activeOrtIndex = signal(-1);

  constructor() {
    this.form = this.fs.form.get('grundstueck') as FormGroup;
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
        await this.fs.sucheGrundbuchamt(value, orte[0]);
      } else if (orte.length > 1) {
        if (!orte.includes(this.form.controls['ort'].value)) {
          this.form.controls['ort'].setValue('');
        } else {
          await this.fs.sucheGrundbuchamt(value, this.form.controls['ort'].value);
        }
        if (document.activeElement === input || document.activeElement?.id === 'ortgrundstückinput') {
          this.ortDropdownOpen.set(true);
        }
      } else {
        this.form.controls['ort'].setValue('');
        this.ortDropdownOpen.set(false);
        await this.fs.sucheGrundbuchamt(value);
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
    void this.fs.sucheGrundbuchamt(this.form.controls['plz'].value, ort);
  }

  sucheGrundbuchamt() {
    const plz = this.form.controls['plz'].value;
    const ort = this.form.controls['ort'].value;
    if (plz?.length === 5 && ort) {
      void this.fs.sucheGrundbuchamt(plz, ort);
    }
  }

  anschriftuebernehmen() {
    const antragsteller = (this.fs.form.value as Antrag).antragsteller;
    this.orte.set([]);
    this.ortDropdownOpen.set(false);
    this.activeOrtIndex.set(-1);
    this.form.controls['plz'].setValue(antragsteller.plz);
    this.form.controls['straße'].setValue(antragsteller.straße);
    this.form.controls['ort'].setValue(antragsteller.ort);
    void this.fs.sucheGrundbuchamt(antragsteller.plz, antragsteller.ort);
  }
}
