import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookiesService } from 'src/app/services/cookies.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(router: Router, cs: CookiesService){
    const token = cs.getCookie('token');
    if(token == '') router.navigate(['/'])
  }

}
