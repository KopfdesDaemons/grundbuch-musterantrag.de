import { Request, Response, NextFunction } from 'express';
import { RateLimitStats } from 'server/types/rate-limit-stats.type';

const requestCounts: Record<string, RateLimitStats> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const now = Date.now();

  // Request limit
  const timeLimit = 15 * 60 * 1000; // 15 minutes
  const maxRequestsPerTimeLimit = 100;

  // Daily limit
  const dailyTimeLimit = 24 * 60 * 60 * 1000; // 24 hours
  const maxRequestsPerDay = 500;

  if (!ip) {
    return res.status(400).json({ message: 'IP-Adresse fehlt.' });
  }

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, windowStart: now, dailyCount: 1, dailyStart: now };
  } else {
    const stats = requestCounts[ip];

    // Check request limit
    const timeSinceWindowStart = now - stats.windowStart;
    if (timeSinceWindowStart < timeLimit) {
      stats.count += 1;
    } else {
      // Reset after time window
      stats.count = 1;
      stats.windowStart = now;
    }

    // Check daily limit
    const timeSinceDailyStart = now - stats.dailyStart;
    if (timeSinceDailyStart < dailyTimeLimit) {
      stats.dailyCount += 1;
    } else {
      stats.dailyCount = 1;
      stats.dailyStart = now;
    }
  }

  if (requestCounts[ip].count > maxRequestsPerTimeLimit) {
    return res.status(429).json({ message: 'Zu viele Anfragen, bitte versuchen Sie es später erneut.' });
  }

  if (requestCounts[ip].dailyCount > maxRequestsPerDay) {
    return res.status(429).json({ message: 'Tägliches Limit überschritten, bitte versuchen Sie es morgen erneut.' });
  }

  return next();
};
