import { Component } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import { FormService } from 'src/app/services/form.service';
import { Title } from '@angular/platform-browser';
import { AntragGrundbuchausdruck } from 'src/app/models/antragGrundbuchausdruck';

@Component({
  selector: 'app-grundbuchausdruck-beantragen',
  templateUrl: './grundbuchausdruck-beantragen.component.html',
  styleUrls: ['./grundbuchausdruck-beantragen.component.scss']
})
export class GrundbuchausdruckBeantragenComponent {

  constructor(
    private titleService: Title,
    public fs: FormService,
    public dl: DesignloaderService,
  ) {
    this.titleService.setTitle('Musterantrag Grundbuchausdruck');

    const antrag: AntragGrundbuchausdruck = new AntragGrundbuchausdruck();
    fs.init(antrag.getFormGroup());
  }
}
