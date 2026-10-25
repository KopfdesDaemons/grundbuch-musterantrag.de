import { Component } from '@angular/core';
import { TabNavigationComponent } from 'src/app/components/dashboard/tab-navigation/tab-navigation.component';

@Component({
  imports: [TabNavigationComponent],
  selector: 'app-router',
  styleUrl: './router.component.scss',
  templateUrl: './router.component.html'
})
export class RouterComponent {
  tabs = [
    {
      name: 'Anzahl',
      route: '/dashboard/statistic/'
    },
    {
      name: 'Ausfüllzeiten',
      route: '/dashboard/statistic/time-tracking'
    }
  ];
}
