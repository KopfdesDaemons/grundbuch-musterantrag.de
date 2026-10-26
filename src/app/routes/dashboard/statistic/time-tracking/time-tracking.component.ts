import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FORM_SECTION_LABELS } from 'common/models/upload.model';
import { TimeTrackingStatistic, TimeTrackingStatusFilter } from 'common/interfaces/statistic.interface';
import { TimeTrackingRow } from 'src/app/interfaces/time-tracking-row';
import { StatisticService } from 'src/app/services/data/statistic.service';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-time-tracking',
  imports: [FormsModule, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './time-tracking.component.html',
  styleUrl: './time-tracking.component.scss'
})
export class TimeTrackingComponent {
  protected readonly statisticS = inject(StatisticService);

  protected readonly monthNames = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember'
  ];
  protected readonly years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  protected selectedMonth = signal<number | undefined>(new Date().getMonth());
  protected selectedYear = signal<number>(new Date().getFullYear());
  protected selectedStatus = signal<TimeTrackingStatusFilter>('finished');

  private rowsMap = new Map<string, TimeTrackingRow>();
  rows = linkedSignal<TimeTrackingStatistic[], TimeTrackingRow[]>({
    source: () => this.statisticS.timeTrackingResource.value() ?? [],
    computation: (stats, previous) => {
      if (!stats) {
        return previous?.value ?? [];
      }
      return stats.map(stat => {
        if (this.rowsMap.has(stat.antragsart)) {
          const existing = this.rowsMap.get(stat.antragsart)!;
          existing.stat = stat;
          return existing;
        }
        const newRow: TimeTrackingRow = { stat, editMode: false };
        this.rowsMap.set(stat.antragsart, newRow);
        return newRow;
      });
    }
  });

  protected readonly totalTrackedCount = computed(() => {
    if (this.statisticS.timeTrackingResource.error() || this.statisticS.timeTrackingResource.isLoading()) {
      return '';
    }
    const stats = this.statisticS.timeTrackingResource.value() ?? [];
    return stats.reduce((sum, item) => sum + item.count, 0);
  });

  monthChanged(month: string) {
    const newMonth = month === 'all' ? undefined : this.monthNames.indexOf(month);
    this.selectedMonth.set(newMonth);
    this.rowsMap.clear();
    this.statisticS.setTimeTrackingFilter(newMonth === undefined ? undefined : newMonth + 1, this.selectedYear(), this.selectedStatus());
  }

  yearChanged(year: string) {
    const newYear = Number(year);
    this.selectedYear.set(newYear);
    this.rowsMap.clear();
    const month = this.selectedMonth();
    this.statisticS.setTimeTrackingFilter(month === undefined ? undefined : month + 1, newYear, this.selectedStatus());
  }

  statusChanged(status: string) {
    const newStatus = status as TimeTrackingStatusFilter;
    this.selectedStatus.set(newStatus);
    this.rowsMap.clear();
    const month = this.selectedMonth();
    this.statisticS.setTimeTrackingFilter(month === undefined ? undefined : month + 1, this.selectedYear(), newStatus);
  }

  reload() {
    this.rowsMap.clear();
    this.statisticS.reloadTimeTracking();
  }

  getSectionLabel(section: string): string {
    return FORM_SECTION_LABELS[section] ?? section;
  }

  formatDuration(durationMs?: number): string {
    if (!durationMs || durationMs <= 0) return 'nicht bekannt';
    const totalSeconds = Math.max(1, Math.round(durationMs / 1000));
    if (totalSeconds < 60) {
      return `${totalSeconds} Sek.`;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} Min. ${seconds} Sek.`;
  }
}
