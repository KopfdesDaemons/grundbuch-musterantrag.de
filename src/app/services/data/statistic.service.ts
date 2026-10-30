import { httpResource } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { TimeTrackingStatistic, TimeTrackingStatusFilter } from 'common/interfaces/statistic.interface';

@Injectable({
  providedIn: 'root'
})
export class StatisticService {
  /**
   * Statistic per day for last week
   */
  private readonly _statisticResourceWeek = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/statistic/numberPerDay',
    params: {
      timeframe: 'week'
    }
  }));

  readonly statisticResourceLastWeek = this._statisticResourceWeek.asReadonly();

  reloadStatisticLastWeek() {
    this._statisticResourceWeek.reload();
  }

  /**
   * Statistic per day for last month
   */
  private readonly _statisticResourceLastMonth = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/statistic/numberPerDay',
    params: {
      timeframe: 'month'
    }
  }));

  readonly statisticResourceLastMonth = this._statisticResourceLastMonth.asReadonly();

  reloadStatisticLastMonth() {
    this._statisticResourceLastMonth.reload();
  }

  /**
   * Statistic per day for specific time frame
   */
  private specificTimeFrameMonth = signal<number | undefined>(new Date().getMonth() + 1);
  private specificTimeFrameYear = signal<number | undefined>(new Date().getFullYear());
  private readonly _statisticResourceSpecificTimeframe = httpResource<{ date: string; count: number }[]>(() => ({
    url: '/api/statistic/numberPerDay',
    params: {
      month: this.specificTimeFrameMonth() ?? '',
      year: this.specificTimeFrameYear() ?? ''
    }
  }));

  readonly statisticResourceSpecificTimeframe = this._statisticResourceSpecificTimeframe.asReadonly();

  setStatisticSpecificTimeframe(month: number | undefined, year: number | undefined) {
    this.specificTimeFrameMonth.set(month);
    this.specificTimeFrameYear.set(year);
  }

  reloadStatisticSpecificTimeframe() {
    this._statisticResourceSpecificTimeframe.reload();
  }

  /**
   * Total statistic by type
   */
  private readonly _statisticByTypTotalResource = httpResource<{ antragsart: string; anzahl: number }[]>(() => ({ url: '/api/statistic/type' }), {
    parse: data => this.getObjectArrayForStatisticByTpe(data as { [key: string]: number } | undefined)
  });

  readonly statisticByTypTotalResource = this._statisticByTypTotalResource.asReadonly();

  reloadStatisticByTypTotal() {
    this._statisticByTypTotalResource.reload();
  }

  /**
   * Statistic by type and specific time frame
   */
  private readonly _statisticByTypAndTimeframeResource = httpResource<{ antragsart: string; anzahl: number }[]>(
    () => ({
      url: '/api/statistic/typeByTimeframe',
      params: {
        month: this.specificTimeFrameMonth() ?? '',
        year: this.specificTimeFrameYear() ?? ''
      }
    }),
    {
      parse: data => this.getObjectArrayForStatisticByTpe(data as { [key: string]: number } | undefined)
    }
  );

  readonly statisticByTypAndTimeframeResource = this._statisticByTypAndTimeframeResource.asReadonly();

  reloadStatisticByTypAndTimeframe() {
    this._statisticByTypAndTimeframeResource.reload();
  }

  /**
   * Time tracking statistic for specific time frame and status
   */
  private timeTrackingMonth = signal<number | undefined>(new Date().getMonth() + 1);
  private timeTrackingYear = signal<number | undefined>(new Date().getFullYear());
  private timeTrackingStatus = signal<TimeTrackingStatusFilter>('finished');

  private readonly _timeTrackingResource = httpResource<TimeTrackingStatistic[]>(() => ({
    url: '/api/statistic/timeTracking',
    params: {
      month: this.timeTrackingMonth() ?? '',
      year: this.timeTrackingYear() ?? '',
      status: this.timeTrackingStatus()
    }
  }));

  readonly timeTrackingResource = this._timeTrackingResource.asReadonly();

  setTimeTrackingFilter(month: number | undefined, year: number | undefined, status: TimeTrackingStatusFilter = this.timeTrackingStatus()) {
    this.timeTrackingMonth.set(month);
    this.timeTrackingYear.set(year);
    this.timeTrackingStatus.set(status);
  }

  reloadTimeTracking() {
    this._timeTrackingResource.reload();
  }

  private getObjectArrayForStatisticByTpe(statisticObject: { [key: string]: number } | undefined): { antragsart: string; anzahl: number }[] {
    if (!statisticObject) return [];

    return Object.entries(statisticObject)
      .map(([key, value]) => ({ antragsart: key, anzahl: value }))
      .sort((a, b) => b.anzahl - a.anzahl);
  }
}
