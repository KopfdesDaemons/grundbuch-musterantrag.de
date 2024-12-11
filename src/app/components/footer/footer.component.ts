import { Component, inject } from '@angular/core';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
    imports: [FormsModule, FaIconComponent, RouterLink]
})

export class FooterComponent {
  // Injections
  authS = inject(AuthService);

  faRightToBracket = faRightToBracket;
}
