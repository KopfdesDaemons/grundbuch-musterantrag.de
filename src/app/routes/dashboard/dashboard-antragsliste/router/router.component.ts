import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TabNavigationComponent } from 'src/app/components/dashboard/tab-navigation/tab-navigation.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TabNavigationComponent],
  selector: 'app-router',
  styleUrl: './router.component.scss',
  templateUrl: './router.component.html'
})
export class RouterComponent {
  tabs = [
    {
      name: 'Anträge',
      route: '/dashboard/antragsliste'
    },
    {
      name: 'Feedback',
      route: '/dashboard/antragsliste/feedback'
    }
  ];
}

