import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { Log } from 'common/models/log.model';
import { readLogFile } from 'server/helpers/log-file.helper';

const pageSize = 20;

export interface LogFilterOptions {
  level?: string;
  search?: string;
  grouped?: boolean;
}

export const getLogs = async (page: number = 1, options: LogFilterOptions = {}): Promise<PaginatedApiResponse<Log>> => {
  const allLogs = await readLogFile();

  let filteredLogs = allLogs;

  if (options.level && options.level !== 'all') {
    const levelFilter = options.level.toLowerCase();
    filteredLogs = filteredLogs.filter(log => log.level.toLowerCase() === levelFilter);
  }

  if (options.search && options.search.trim() !== '') {
    const term = options.search.trim().toLowerCase();
    filteredLogs = filteredLogs.filter(
      log =>
        log.message?.toLowerCase().includes(term) ||
        log.route?.toLowerCase().includes(term) ||
        log.stack?.toLowerCase().includes(term)
    );
  }

  let processedLogs: Log[] = filteredLogs;

  if (options.grouped !== false) {
    const groupedMap = new Map<string, Log>();

    for (const log of filteredLogs) {
      const key = `${log.level}\0${log.message}\0${log.stack ?? ''}`;
      const existing = groupedMap.get(key);

      if (!existing) {
        const routes = log.route ? [log.route] : [];
        groupedMap.set(
          key,
          new Log(log.level, log.message, log.timestamp, log.stack, log.route, 1, log.timestamp, routes)
        );
      } else {
        existing.count = (existing.count ?? 1) + 1;
        existing.firstTimestamp = log.timestamp;
        if (log.route && existing.routes && !existing.routes.includes(log.route)) {
          existing.routes.push(log.route);
          existing.route = existing.routes.join(', ');
        }
      }
    }

    processedLogs = Array.from(groupedMap.values());
  }

  const offset = (page - 1) * pageSize;
  const pagedLogs = processedLogs.slice(offset, offset + pageSize);

  const totalItems = processedLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    totalPages,
    totalItems,
    items: pagedLogs
  };
};
