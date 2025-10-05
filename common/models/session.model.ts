export class Session {
  systemType: string;
  ip: string;
  creationDate: Date;
  expiryDate: Date;

  constructor(userAgent: string, ip: string, creationDate: Date, expiryDate: Date) {
    this.systemType = userAgent;
    this.ip = ip;
    this.creationDate = creationDate;
    this.expiryDate = expiryDate;
  }
}
