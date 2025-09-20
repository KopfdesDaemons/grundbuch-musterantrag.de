import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../../components/footer/footer.component';
import { ArtikelsidebarComponent } from '../../../components/artikelsidebar/artikelsidebar.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ArtikelsidebarComponent, HeaderComponent],
  templateUrl: './root.component.html',
  styleUrl: './root.component.scss'
})
export class RootComponent {}
