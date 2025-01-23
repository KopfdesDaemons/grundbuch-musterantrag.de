import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-rooter',
  imports: [RouterOutlet, RouterLink, NgClass],
  templateUrl: './rooter.component.html',
  styleUrl: './rooter.component.scss'
})
export class RooterComponent {
  router = inject(Router)

  tabs = [
    {
      name: 'User-Liste',
      route: '/dashboard/users'
    },
    {
      name: 'User erstellen',
      route: '/dashboard/users/create-user'
    }
  ]
}
