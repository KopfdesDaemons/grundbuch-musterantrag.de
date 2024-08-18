import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
    selector: 'app-impressum',
    templateUrl: './impressum.component.html',
    styleUrls: ['./impressum.component.scss'],
    standalone: true,
    imports: [HeaderComponent, FooterComponent]
})
export class ImpressumComponent {
  constructor(public titleService: Title){
    this.titleService.setTitle('Impressum');
  }
}
