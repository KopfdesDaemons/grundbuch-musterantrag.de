import { Component, inject, OnInit } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { LoggerService } from 'src/app/services/logger.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";

@Component({
    selector: 'app-logger-tile',
    imports: [DashboardTileComponent, FaIconComponent, ProgressSpinnerComponent],
    templateUrl: './logger-tile.component.html',
    styleUrl: './logger-tile.component.scss'
})
export class LoggerTileComponent implements OnInit {
  // Injections
  loggerS = inject(LoggerService);

  logs: { timestamp: string, message: string }[] | null | undefined = undefined;

  // Fontawesome Icons
  faTrashCan = faTrashCan;

  async ngOnInit(): Promise<void> {
    this.logs = await this.loggerS.getLogFile();
  }

  async deleteLogFile() {
    await this.loggerS.deleteLogFile();
    this.logs = null;
  }
}
