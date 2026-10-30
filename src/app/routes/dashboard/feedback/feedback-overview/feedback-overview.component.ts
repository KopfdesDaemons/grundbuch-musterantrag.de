import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FeedbackEvaluation } from 'common/interfaces/feedback.interface';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback-overview',
  imports: [DecimalPipe, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './feedback-overview.component.html',
  styleUrl: './feedback-overview.component.scss'
})
export class FeedbackOverviewComponent {
  protected readonly uploadsS = inject(UploadsService);

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

  protected readonly selectedMonth = computed<number | undefined>(() => {
    const m = this.uploadsS.selectedFeedbackMonth();
    return m !== undefined ? m - 1 : undefined;
  });

  protected readonly selectedYear = this.uploadsS.selectedFeedbackYear;

  protected readonly evaluation = computed<FeedbackEvaluation | undefined>(() => {
    return this.uploadsS.feedbackResource.hasValue() ? this.uploadsS.feedbackResource.value() : undefined;
  });

  protected readonly feedbackRate = computed<number>(() => {
    const evalData = this.evaluation();
    if (!evalData || evalData.totalUploads === 0) return 0;
    return Math.round((evalData.totalRatings / evalData.totalUploads) * 100);
  });

  monthChanged(month: string) {
    const newMonthIdx = month === 'all' ? undefined : this.monthNames.indexOf(month);
    const year = this.selectedYear();
    this.uploadsS.setFeedbackFilter(newMonthIdx === undefined || year === undefined ? undefined : newMonthIdx + 1, year);
  }

  yearChanged(year: string) {
    const newYear = year === 'all' ? undefined : Number(year);
    if (newYear === undefined) {
      this.uploadsS.setFeedbackFilter(undefined, undefined);
    } else {
      const monthIdx = this.selectedMonth();
      this.uploadsS.setFeedbackFilter(monthIdx === undefined ? undefined : monthIdx + 1, newYear);
    }
  }

  reload() {
    this.uploadsS.reloadFeedback();
  }

  isStarFilled(star: number, rating: number | null | undefined): boolean {
    if (!rating) return false;
    return star <= Math.round(rating);
  }
}

