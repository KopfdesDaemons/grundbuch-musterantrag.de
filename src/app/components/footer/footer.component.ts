import { Component, ElementRef, ViewChild } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import {
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  anmeldeInputVisible = false;
  @ViewChild('password') passwordInput!:ElementRef;

  constructor(public dl: DesignloaderService, public http: HttpClient, public Router: Router){}
  faRightToBracket = faRightToBracket;

  anmeldeBtnClick(){
    this.anmeldeInputVisible = !this.anmeldeInputVisible;
    this.passwordInput.nativeElement.focus();
  }

  async anmelden(password: string){
    const observable = this.http.post('/api/login', { password: password }, {responseType: 'text' ,observe: 'response'});
    try{
      const response = await firstValueFrom(observable);
      console.log("Login erfolgreich");
      this.Router.navigate(['/dashboard'])
    } catch (error: any) {
      console.log("Login nicht erfolgreich:");
      console.error(error);
    }
  }
}
