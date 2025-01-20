import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { SidemenuComponent } from '../sidemenu/sidemenu.component';
import { SidemenuService } from 'src/app/services/sidemenu.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, SidemenuComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  sidemenuS = inject(SidemenuService)

}
