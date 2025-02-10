import { Component, input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconProp } from '@fortawesome/angular-fontawesome/types';

@Component({
  selector: 'app-login-card',
  imports: [FontAwesomeModule],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent {
  faIcon = input.required<IconProp>();
  title = input.required<string>();
  imagePath = input.required<string>();
  description = input<string>();
}
