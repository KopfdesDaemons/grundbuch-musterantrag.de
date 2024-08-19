import { Component, inject } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { LoggerService } from 'src/app/services/logger.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-logger-tile',
  standalone: true,
  imports: [DashboardTileComponent, FaIconComponent],
  templateUrl: './logger-tile.component.html',
  styleUrl: './logger-tile.component.scss'
})
export class LoggerTileComponent {
  // Injections
  loggerS = inject(LoggerService);

  // Fontawesome Icons
  faTrashCan = faTrashCan;
}
