import { Request, Response, NextFunction } from 'express';

const requestCounts: Record<string, { count: number; lastRequest: number; dailyCount: number; dailyStart: number }> = {};

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  const now = Date.now();

  // Request limit
  const timeLimit = 15 * 60 * 1000; // 15 minutes
  const maxRequestsPerTimeLimit = 50;

  // Daily limit
  const dailyTimeLimit = 24 * 60 * 60 * 1000; // 24 hours
  const maxRequestsPerDay = 500;

  if (!ip) {
    return res.status(400).json({ message: 'IP-Adresse fehlt.' });
  }

  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 1, lastRequest: now, dailyCount: 1, dailyStart: now };
  } else {
    const stats = requestCounts[ip];

    // Check request limit
    const timeSinceLastRequest = now - stats.lastRequest;
    if (timeSinceLastRequest < timeLimit) {
      stats.count += 1;
    } else {
      // Reset after time window
      stats.count = 1;
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
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }

  if (requestCounts[ip].dailyCount > maxRequestsPerDay) {
    return res.status(429).json({ message: 'Daily limit exceeded, please try again tomorrow.' });
  }

  requestCounts[ip].lastRequest = now;
  return next();
};
