import { Component, inject, OnInit } from '@angular/core';
import { DashboardTileComponent } from "../../dashboard-tile/dashboard-tile.component";
import { LoggerService } from 'src/app/services/server/logger.service';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ProgressSpinnerComponent } from "../../../progress-spinner/progress-spinner.component";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorDisplayComponent } from "../../../error-display/error-display.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-logger-tile',
  imports: [DashboardTileComponent, FaIconComponent, ProgressSpinnerComponent, ErrorDisplayComponent, NgClass],
  templateUrl: './logger-tile.component.html',
  styleUrl: './logger-tile.component.scss'
})
export class LoggerTileComponent implements OnInit {
  loggerS = inject(LoggerService);
  logs: { level: string, timestamp: string, message: string }[] | null | undefined = undefined;
  error: HttpErrorResponse | null = null;
  faTrashCan = faTrashCan;


  async ngOnInit(): Promise<void> {
    await this.loadLogFile();
  }

  async deleteLogFile() {
    try {
      this.error = null;
      await this.loggerS.deleteLogFile();
      await this.loadLogFile();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  async loadLogFile() {
    try {
      this.error = null;
      this.logs = await this.loggerS.getLogFile();
    } catch (error) {
      if (error instanceof HttpErrorResponse) {
        this.error = error;
      }
    }
  }

  addLineBreak(timestamp: string): string {
    const dateAndTime = timestamp.split(" ");
    const date = dateAndTime[0];
    const time = dateAndTime[1];
    return `${date} ${time}\u00A0Uhr`;
  }
}
