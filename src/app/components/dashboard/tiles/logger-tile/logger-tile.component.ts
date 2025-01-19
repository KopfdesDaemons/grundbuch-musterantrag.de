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
  loggerS = inject(LoggerService);
  logs: { timestamp: string, message: string }[] | null | undefined = undefined;
  error: boolean = false;
  faTrashCan = faTrashCan;


  async ngOnInit(): Promise<void> {
    await this.loadLogFile();
  }

  async deleteLogFile() {
    await this.loggerS.deleteLogFile();
    await this.loadLogFile();
  }

  async loadLogFile() {
    try {
      this.error = false;
      this.logs = await this.loggerS.getLogFile();
    } catch {
      this.error = true;
    }
  }
}
