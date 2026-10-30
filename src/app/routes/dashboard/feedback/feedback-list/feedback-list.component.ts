import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FeedbackEvaluation, FeedbackItem } from 'common/interfaces/feedback.interface';
import { ErrorDisplayComponent } from 'src/app/components/error-display/error-display.component';
import { ProgressSpinnerComponent } from 'src/app/components/progress-spinner/progress-spinner.component';
import { UploadsService } from 'src/app/services/data/uploads.service';

export type FeedbackListFilter = 'all' | 'withText' | '5' | '4' | '3' | '2' | '1';

const DEFAULT_ANTRAGSARTEN: readonly string[] = [
  'Erteilung eines Grundbuchausdrucks',
  'Grundbuchberichtigung aufgrund eines Sterbefalls',
  'Löschung von Lasten und Beschränkungen',
  'Namensberichtigung einer natürlichen Person',
  'Erteilung von Abschriften einer Bewilligung',
  'Teilungserklärung, Abgeschlossenheits\u00ADbescheinigung, Aufteilungsplan'
];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-feedback-list',
  imports: [DatePipe, ErrorDisplayComponent, ProgressSpinnerComponent],
  templateUrl: './feedback-list.component.html',
  styleUrl: './feedback-list.component.scss'
})
export class FeedbackListComponent {
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

  protected readonly selectedAntragsart = signal<string>('all');
  protected readonly listFilter = signal<FeedbackListFilter>('all');

  protected readonly evaluation = computed<FeedbackEvaluation | undefined>(() => {
    return this.uploadsS.feedbackResource.hasValue() ? this.uploadsS.feedbackResource.value() : undefined;
  });

  protected readonly antragsarten = computed<string[]>(() => {
    const evalData = this.evaluation();
    const set = new Set<string>(DEFAULT_ANTRAGSARTEN);
    for (const entry of evalData?.byAntragsart ?? []) {
      if (entry.antragsart) set.add(entry.antragsart);
    }
    for (const item of evalData?.items ?? []) {
      if (item.antragsart) set.add(item.antragsart);
    }
    return Array.from(set);
  });

  protected readonly filteredItems = computed<FeedbackItem[]>(() => {
    let items = this.evaluation()?.items ?? [];
    const antragsart = this.selectedAntragsart();
    const filter = this.listFilter();

    if (antragsart !== 'all') {
      items = items.filter(item => item.antragsart === antragsart);
    }

    if (filter === 'withText') {
      items = items.filter(item => !!item.feedbackText && item.feedbackText.trim().length > 0);
    } else if (filter !== 'all') {
      const targetStars = Number(filter);
      items = items.filter(item => item.rating === targetStars);
    }

    return items;
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

  antragsartChanged(antragsart: string) {
    this.selectedAntragsart.set(antragsart);
  }

  listFilterChanged(filter: string) {
    this.listFilter.set(filter as FeedbackListFilter);
  }

  reload() {
    this.uploadsS.reloadFeedback();
  }
}

