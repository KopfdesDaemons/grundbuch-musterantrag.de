export interface Statistic {
  [key: string]: number;
}

export type TimeTrackingStatusFilter = 'all' | 'finished' | 'abandoned';

export interface TimeTrackingSectionStatistic {
  name: string;
  durationMs: number;
}

export interface TimeTrackingStatistic {
  antragsart: string;
  count: number;
  totalDurationMs: number;
  sections: TimeTrackingSectionStatistic[];
}
