import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss']
})
export class DatenschutzComponent {

  constructor(private titleService: Title, public cs: CookiesService) {
    this.titleService.setTitle('Datenschutzerklärung');
  }

  deleteCookies(){
    this.cs.deleteAllCookies();
    alert('Allle Cookies gelöscht.');
  }
}
