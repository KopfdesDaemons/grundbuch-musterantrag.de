import { Component, inject, input } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  selector: 'app-tab-navigation',
  styleUrl: './tab-navigation.component.scss',
  templateUrl: './tab-navigation.component.html'
})
export class TabNavigationComponent {
  protected readonly router = inject(Router);
  tabs = input.required<{ name: string; route: string }[]>();
}
