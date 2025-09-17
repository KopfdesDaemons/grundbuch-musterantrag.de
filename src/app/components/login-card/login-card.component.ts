import { Component, input } from '@angular/core';

@Component({
  selector: 'app-login-card',
  imports: [],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent {
  title = input.required<string>();
  imagePath = input.required<string>();
  description = input<string>();
}
