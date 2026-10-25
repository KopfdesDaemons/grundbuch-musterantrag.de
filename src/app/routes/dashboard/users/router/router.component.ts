import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TabNavigationComponent } from 'src/app/components/dashboard/tab-navigation/tab-navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-router',
  imports: [TabNavigationComponent],
  templateUrl: './router.component.html',
  styleUrl: './router.component.scss'
})
export class RouterComponent {
  router = inject(Router);

  tabs = [
    {
      name: 'User-Liste',
      route: '/dashboard/users'
    },
    {
      name: 'User erstellen',
      route: '/dashboard/users/create-user'
    },
    {
      name: 'Userrollen',
      route: '/dashboard/users/user-roles'
    }
  ];
}
