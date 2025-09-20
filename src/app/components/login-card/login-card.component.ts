import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { DesignloaderService } from 'src/app/services/ui/designloader.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-login-card',
  imports: [NgClass],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss'
})
export class LoginCardComponent {
  title = input.required<string>();
  imagePath = input.required<string>();
  description = input<string>();
  designS = inject(DesignloaderService);
}
