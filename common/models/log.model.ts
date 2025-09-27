import { LogEntry } from 'winston';

export class Log implements LogEntry {
  level: string;
  message: string;
  timestamp: Date;
  stack?: string;
  path?: string;

  constructor(level: string, message: string, timestamp: Date, stack?: string, path?: string) {
    this.level = level;
    this.message = message;
    this.timestamp = timestamp;
    this.stack = stack;
    this.path = path;
  }
}
