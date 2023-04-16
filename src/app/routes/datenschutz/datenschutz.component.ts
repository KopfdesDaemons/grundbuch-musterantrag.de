import { Component } from '@angular/core';
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-datenschutz',
  templateUrl: './datenschutz.component.html',
  styleUrls: ['./datenschutz.component.scss']
})
export class DatenschutzComponent {

  constructor(public cs: CookiesService){}

  deleteCookies(){
    this.cs.deleteAllCookies();
    alert('Allle Cookies gelöscht.');
  }
}
