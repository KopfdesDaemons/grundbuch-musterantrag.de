import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  /** 
  *Gibt das Datum im Format DD.MM.YYYY zurück
  *@param date - Datum, das formatiert werden soll. Standard: aktuelles Datum
  *@returns {string} - DD.MM.YYYY
  **/
  formatDate(date: Date = new Date()): string {
    // Tag, Monat und Jahr extrahieren
    const tag = String(date.getDate()).padStart(2, '0');
    const monat = String(date.getMonth() + 1).padStart(2, '0');
    const jahr = date.getFullYear();

    // Formatierung zum gewünschten Format
    return `${tag}.${monat}.${jahr}`;
  }

  /** 
  *Gibt die Uhrzeit im Format HH.MM Uhr zurück
  *@param date - Uhrzeit, die formatiert werden soll. Standard: aktuelle Uhrzeit
  *@returns {string} - HH.MM Uhr
  **/
  formatTime(date: Date = new Date()): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}.${minutes} Uhr`;
  }

  /**
   * Gibt die Tageszeit zurück
   * @param date - Tageszeit, die formatiert werden soll. Standard: aktuelle Tageszeit
   * @returns {string} - "Morgen", "Tag", oder "Abend"
   */
  getTimeOfDay(date: Date = new Date()): string {
    const stunde = date.getHours();

    if (stunde >= 5 && stunde < 12) {
      return "Morgen";
    } else if (stunde >= 12 && stunde < 18) {
      return "Tag";
    } else {
      return "Abend";
    }
  }
}
