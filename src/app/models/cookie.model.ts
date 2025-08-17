export class Cookie {
  name: string;
  value: string;
  days: number;
  consentQuestion: string;

  constructor(name: string, value: string, days: number, consentQuestion: string) {
    this.name = name;
    this.value = value;
    this.days = days;
    this.consentQuestion = consentQuestion;
  }
}
