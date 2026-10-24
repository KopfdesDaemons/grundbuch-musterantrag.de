import { LogEntry } from 'winston';

export class Log implements LogEntry {
  level: string;
  message: string;
  timestamp: Date;
  stack?: string;
  route?: string;
  count?: number;
  firstTimestamp?: Date;
  routes?: string[];

  constructor(
    level: string,
    message: string,
    timestamp: Date,
    stack?: string,
    path?: string,
    count?: number,
    firstTimestamp?: Date,
    routes?: string[]
  ) {
    this.level = level;
    this.message = message;
    this.timestamp = timestamp;
    this.stack = stack;
    this.route = path;
    this.count = count;
    this.firstTimestamp = firstTimestamp;
    this.routes = routes;
  }
}
