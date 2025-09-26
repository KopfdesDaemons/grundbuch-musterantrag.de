import { PaginatedApiResponse } from 'common/interfaces/pagination-data.interface';
import { Log } from 'common/models/log.model';
import { readLogFile } from 'server/helpers/log-file.helper';

const pageSize = 20;

export const getLogs = async (page: number = 1): Promise<PaginatedApiResponse<Log> | null> => {
  const allLogs = await readLogFile();

  if (allLogs.length === 0) {
    return null;
  }

  const offest = (page - 1) * pageSize;
  const pagedLogs = allLogs.slice(offest, offest + pageSize);

  const totalItems = allLogs.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    page,
    totalPages,
    totalItems,
    items: pagedLogs
  };
};
