export class cookie {
    name: string;
    value: string;
    days: number;
    consent: string;
    constructor(name: string, value: string, days:number, consent: string) {
      this.name = name;
      this.value = value;
      this.days = days;
      this.consent = consent
    }
  }