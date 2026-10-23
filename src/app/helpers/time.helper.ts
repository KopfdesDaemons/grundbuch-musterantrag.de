export abstract class TimeHelper {
  private static readonly TIMEZONE = 'Europe/Berlin';

  /**
   *Gibt das Datum im Format DD.MM.YYYY zurück
   *@param date - Datum, das formatiert werden soll. Standard: aktuelles Datum
   *@returns {string} - DD.MM.YYYY
   **/
  static formatDate(date: Date = new Date()): string {
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: TimeHelper.TIMEZONE
    }).format(date);
  }

  /**
   *Gibt die Uhrzeit im Format HH.MM Uhr zurück
   *@param date - Uhrzeit, die formatiert werden soll. Standard: aktuelle Uhrzeit
   *@returns {string} - HH.MM Uhr
   **/
  static formatTime(date: Date = new Date()): string {
    const parts = new Intl.DateTimeFormat('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: TimeHelper.TIMEZONE
    }).formatToParts(date);
    const hours = parts.find(p => p.type === 'hour')?.value ?? '00';
    const minutes = parts.find(p => p.type === 'minute')?.value ?? '00';
    return `${hours}.${minutes} Uhr`;
  }

  /**
   * Gibt die Tageszeit zurück
   * @param date - Tageszeit, die formatiert werden soll. Standard: aktuelle Tageszeit
   * @returns {string} - "Morgen", "Tag", oder "Abend"
   */
  static getTimeOfDay(date: Date = new Date()): string {
    const stunde = Number(
      new Intl.DateTimeFormat('de-DE', {
        hour: 'numeric',
        hour12: false,
        timeZone: TimeHelper.TIMEZONE
      }).format(date)
    );

    if (stunde >= 5 && stunde < 12) {
      return 'Morgen';
    } else if (stunde >= 12 && stunde < 18) {
      return 'Tag';
    } else {
      return 'Abend';
    }
  }
}
