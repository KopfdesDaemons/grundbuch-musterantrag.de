import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  host: {
    '[hidden]': '!active()',
    '[class.active]': 'active()',
    'role': 'tabpanel'
  }
})
export class TabComponent {
  readonly title = input<string>('');
  readonly name = input<string>('');
  readonly label = input<string>('');
  readonly initiallyActive = input<boolean>(false, { alias: 'active' });

  readonly active = signal<boolean>(false);

  get tabTitle(): string {
    return this.title() || this.name() || this.label();
  }
}
