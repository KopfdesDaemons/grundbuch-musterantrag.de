import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class RefreshToken {
  tokenID?: string;
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

  setTokenHash = async (token: string): Promise<void> => {
    const salt = randomBytes(16).toString('hex');
    const buf = (await scryptAsync(token, salt, 64)) as Buffer;
    this.tokenHash = `${buf.toString('hex')}.${salt}`;
  };

  compareTokens = async (token: string): Promise<boolean> => {
    if (!this.tokenHash) {
      throw new Error('No Token Hash from DB');
    }
    if (!token) {
      throw new Error('No Token Hash');
    }
    const [hashedToken, salt] = this.tokenHash.split('.');
    const hashedTokenBuf = Buffer.from(hashedToken, 'hex');
    const suppliedTokenBuf = (await scryptAsync(token, salt, 64)) as Buffer;
    return timingSafeEqual(hashedTokenBuf, suppliedTokenBuf);
  };
}
