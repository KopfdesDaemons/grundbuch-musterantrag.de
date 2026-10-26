import type { Request } from 'express';

export const CRAWLER_USER_AGENT_REGEX =
  /(?:(?<!cu)bot(?:\b|_|\d|[-/])|crawler|spider|crawling|slurp|headless|bingpreview|preview|mediapartners|whatsapp|claude|baidu|yandex|duckduckgo|google-[a-z]|screaming frog|facebookexternalhit|meta-externalagent|bytespider|gptbot|chatgpt|oai-searchbot|anthropic|perplexity|amazonbot|semrush|ahrefs|mj12|petalbot|dotbot|ccbot|lighthouse|phantomjs|puppeteer|playwright|selenium|webdriver|curl|wget|python|aiohttp|httpx|scrapy|go-http-client|node-fetch|axios|postmanruntime|\+https?:\/\/)/i;

export const isCrawlerUserAgent = (userAgent?: string | null): boolean => {
  if (!userAgent || typeof userAgent !== 'string' || !userAgent.trim()) {
    return true;
  }
  return CRAWLER_USER_AGENT_REGEX.test(userAgent);
};

export const isCrawlerRequest = (req: Request): boolean => {
  const userAgent = req.get('user-agent');
  if (isCrawlerUserAgent(userAgent)) {
    return true;
  }

  const purpose = req.get('purpose') || req.get('x-purpose') || req.get('sec-purpose');
  if (purpose && /preview/i.test(purpose)) {
    return true;
  }

  return false;
};

export const getSystemTypeFromUserAgent = (userAgent: string): string => {
  if (userAgent.includes('Windows')) {
    return 'Windows';
  }
  if (userAgent.includes('Android')) {
    return 'Android';
  }
  if (userAgent.includes('Linux')) {
    return 'Linux';
  }
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
    return 'iOS';
  }
  if (userAgent.includes('Macintosh')) {
    return 'Mac OS';
  }
  return 'Unbekannt';
};
