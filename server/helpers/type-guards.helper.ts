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
