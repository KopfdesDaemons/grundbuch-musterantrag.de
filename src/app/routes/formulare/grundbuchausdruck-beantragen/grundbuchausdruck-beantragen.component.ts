import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';

@Component({
  selector: 'app-grundbuchausdruck-beantragen',
  templateUrl: './grundbuchausdruck-beantragen.component.html',
  styleUrls: ['./grundbuchausdruck-beantragen.component.scss']
})
export class GrundbuchausdruckBeantragenComponent implements OnDestroy {
  step = 1;
  currentStepSubscription: Subscription;

  constructor(
    private titleService: Title,
    public fs: FormService,
    public dl: DesignloaderService,
  ) {
    this.titleService.setTitle('Musterantrag Grundbuchausdruck');

    const antrag: AntragGrundbuchausdruck = new AntragGrundbuchausdruck();
    fs.init(antrag.getFormGroup());
    this.fs.restart();

    this.currentStepSubscription = this.fs.getCurrentStepBehaviorSubject().subscribe(step => {
      this.step = step;

      // Überspringe das Formular für das Grundbuchamt, wenn es automatisch ermittelt wurde
      if (step === 5 && (this.fs.form.get('grundbuchamt') as FormGroup).valid) {
        this.fs.nextStep(6);
      }
    });
  }

  ngOnDestroy(): void {
    this.currentStepSubscription.unsubscribe();
  }
}
