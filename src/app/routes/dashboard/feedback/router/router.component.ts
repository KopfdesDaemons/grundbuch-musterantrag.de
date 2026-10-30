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
      name: 'Übersicht',
      route: '/dashboard/feedback'
    },
    {
      name: 'Feedback-Liste',
      route: '/dashboard/feedback/list'
    }
  ];
}

