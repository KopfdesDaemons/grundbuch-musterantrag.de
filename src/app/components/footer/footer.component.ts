import { Component, ElementRef, ViewChild } from '@angular/core';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthGuard } from 'src/app/auth.guard';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    standalone: true,
    imports: [NgClass, FormsModule, FaIconComponent, RouterLink]
})
export class FooterComponent {
  anmeldeInputVisible = false;
  @ViewChild('password') passwordInput!: ElementRef;

  constructor(public http: HttpClient, public router: Router, public auth: AuthGuard, public authS: AuthService) { }
  faRightToBracket = faRightToBracket;

  anmeldeBtnClick() {
    this.anmeldeInputVisible = !this.anmeldeInputVisible;
    this.passwordInput.nativeElement.focus();
  }
}
