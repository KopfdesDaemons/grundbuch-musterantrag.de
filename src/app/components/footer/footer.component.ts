import { Component, ElementRef, ViewChild } from '@angular/core';
import { DesignloaderService } from 'src/app/services/designloader.service';
import {
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  anmeldeInputVisible = false;
  @ViewChild('password') passwordInput!: ElementRef;

  constructor(public dl: DesignloaderService, public http: HttpClient, public Router: Router, public auth: AuthGuard) { }
  faRightToBracket = faRightToBracket;

  anmeldeBtnClick() {
    this.anmeldeInputVisible = !this.anmeldeInputVisible;
    this.passwordInput.nativeElement.focus();
  }

  async anmelden(password: string) {
    try {
      await firstValueFrom(this.http.post('/api/login', { password: password }, { responseType: 'text', observe: 'response' }));
      console.log("Login erfolgreich");
      this.Router.navigate(['/dashboard'])
    } catch (error: any) {
      switch (error.status) {
        case 401:
          console.log('Login verweigert');
          break;
        case 500:
          const password = prompt('Initalisierung erforderlich. Bitte neues Passwort vergeben:');
          await firstValueFrom(this.http.post('/api/init', { password: password }, { responseType: 'text', observe: 'response' }));
          if (password) this.anmelden(password);
          break
        default:
          console.log("Login nicht erfolgreich: ", error);
      }
    }
  }
}
