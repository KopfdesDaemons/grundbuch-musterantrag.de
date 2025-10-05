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
