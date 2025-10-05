export class RefreshToken {
  tokenID?: number;
  userID: number;
  tokenHash?: string;
  userAgent: string;
  ip: string;
  creationDate: Date;
  expiryDate: Date;
  isRevoked: boolean = false;

  constructor(userID: number, tokenHash: string, creationDate: Date, expiryDate: Date, userAgent: string, ip: string) {
    this.userID = userID;
    this.tokenHash = tokenHash;
    this.creationDate = creationDate;
    this.expiryDate = expiryDate;
    this.userAgent = userAgent;
    this.ip = ip;
  }
}
