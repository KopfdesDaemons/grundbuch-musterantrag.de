import { Log } from 'common/models/log.model';

export const isLogEntry = (obj: unknown): obj is Log => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  return (
    'level' in obj &&
    typeof (obj as any).level === 'string' &&
    'message' in obj &&
    typeof (obj as any).message === 'string' &&
    'timestamp' in obj &&
    (typeof (obj as any).timestamp === 'string' || (obj as any).timestamp instanceof Date) &&
    (!('stack' in obj) || typeof (obj as any).stack === 'string') &&
    (!('route' in obj) || typeof (obj as any).route === 'string')
  );
};

type ValidTimespan = 'week' | 'month';

const isValidTimespan = (value: any): value is ValidTimespan => {
  return ['week', 'month'].includes(value);
};

export type ValidTimeFilterOption = { timeframe: ValidTimespan } | { month: number; year: number } | { year: number };

export const isValidTimeFilterOption = (value: any): value is ValidTimeFilterOption => {
  // Basic check
  if (typeof value !== 'object' || value === null) return false;

  // Check for "timeframe" variant
  if ('timeframe' in value && Object.keys(value).length === 1) {
    return isValidTimespan(value.timeframe);
  }

  // Check for "month/year" variant
  if ('month' in value && 'year' in value && Object.keys(value).length === 2) {
    const { month, year } = value;
    return typeof month === 'number' && typeof year === 'number' && month >= 1 && month <= 12 && year > 1900;
  }

  // Check for "year" variant (no month specified)
  if ('year' in value && Object.keys(value).length === 1) {
    const { year } = value;
    return typeof year === 'number' && year > 1900;
  }

  return false;
};
