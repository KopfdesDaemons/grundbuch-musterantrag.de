import { Request, Response, NextFunction } from 'express';
import { RateLimitStats } from 'server/types/rate-limit-stats.type';

const requestCounts: Record<string, RateLimitStats> = {};

export const loginRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Unvollständige Anfrage für LoginRateLimiter' });
  }

  const now = Date.now();

  // Request limit
  const timeLimit = 15 * 60 * 1000; // 15 minutes
  const maxRequestsPerTimeLimit = 5;

  // Daily limit
  const dailyTimeLimit = 24 * 60 * 60 * 1000; // 24 hours
  const maxRequestsPerDay = 20;

  if (!requestCounts[username]) {
    requestCounts[username] = { count: 1, windowStart: now, dailyCount: 1, dailyStart: now };
  } else {
    const stats = requestCounts[username];

    // Check and reset daily limit window
    if (now - stats.dailyStart > dailyTimeLimit) {
      stats.dailyStart = now;
      stats.dailyCount = 1;
    } else {
      stats.dailyCount++;
    }

    // Check and reset short-term limit window
    if (now - stats.windowStart > timeLimit) {
      stats.windowStart = now;
      stats.count = 1;
    } else {
      stats.count++;
    }
  }

  if (requestCounts[username].count > maxRequestsPerTimeLimit) {
    return res.status(429).json({ message: 'Zu viele Loginversuche, bitte versuchen Sie es später erneut.' });
  }

  if (requestCounts[username].dailyCount > maxRequestsPerDay) {
    return res.status(429).json({ message: 'Tägliches Limit an Loginversuchen überschritten.' });
  }

  return next();
};
