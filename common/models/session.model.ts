export class Session {
  refreshTokenID: number;
  systemType: string;
  ip: string;
  creationDate: Date;
  expiryDate: Date;

  constructor(refreshTokenID: number, userAgent: string, ip: string, creationDate: Date, expiryDate: Date) {
    this.refreshTokenID = refreshTokenID;
    this.systemType = userAgent;
    this.ip = ip;
    this.creationDate = creationDate;
    this.expiryDate = expiryDate;
  }
}
