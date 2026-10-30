import { DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeedbackEvaluation, FeedbackItem } from 'common/interfaces/feedback.interface';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';

export type FeedbackListFilter = 'all' | 'withText' | '5' | '4' | '3' | '2' | '1';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback',
  imports: [DatePipe, DecimalPipe, FormsModule, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent {
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

  protected readonly selectedMonth = signal<number | undefined>(undefined);
  protected readonly selectedYear = signal<number | undefined>(undefined);
  protected readonly listFilter = signal<FeedbackListFilter>('all');

  protected readonly evaluation = computed<FeedbackEvaluation | undefined>(() => {
    return this.uploadsS.feedbackResource.hasValue() ? this.uploadsS.feedbackResource.value() : undefined;
  });

  protected readonly feedbackRate = computed<number>(() => {
    const evalData = this.evaluation();
    if (!evalData || evalData.totalUploads === 0) return 0;
    return Math.round((evalData.totalRatings / evalData.totalUploads) * 100);
  });

  protected readonly filteredItems = computed<FeedbackItem[]>(() => {
    const items = this.evaluation()?.items ?? [];
    const filter = this.listFilter();

    if (filter === 'all') return items;
    if (filter === 'withText') {
      return items.filter(item => !!item.feedbackText && item.feedbackText.trim().length > 0);
    }
    const targetStars = Number(filter);
    return items.filter(item => item.rating === targetStars);
  });

  constructor() {
    this.uploadsS.setFeedbackFilter(undefined, undefined);
  }

  monthChanged(month: string) {
    const newMonth = month === 'all' ? undefined : this.monthNames.indexOf(month);
    this.selectedMonth.set(newMonth);
    const year = this.selectedYear();
    this.uploadsS.setFeedbackFilter(newMonth === undefined || year === undefined ? undefined : newMonth + 1, year);
  }

  yearChanged(year: string) {
    const newYear = year === 'all' ? undefined : Number(year);
    this.selectedYear.set(newYear);
    if (newYear === undefined) {
      this.selectedMonth.set(undefined);
      this.uploadsS.setFeedbackFilter(undefined, undefined);
    } else {
      const month = this.selectedMonth();
      this.uploadsS.setFeedbackFilter(month === undefined ? undefined : month + 1, newYear);
    }
  }

  listFilterChanged(filter: string) {
    this.listFilter.set(filter as FeedbackListFilter);
  }

  reload() {
    this.uploadsS.reloadFeedback();
  }

  isStarFilled(star: number, rating: number | null | undefined): boolean {
    if (!rating) return false;
    return star <= Math.round(rating);
  }
}

