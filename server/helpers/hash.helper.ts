import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH_BYTES = 16;
const HASH_PARTS_COUNT = 2;

export const getHashFromString = async (string: string): Promise<string> => {
  const salt: string = randomBytes(SALT_LENGTH_BYTES).toString('hex');
  const derivedKey = (await scryptAsync(string, salt, KEY_LENGTH)) as Buffer;

  return `${derivedKey.toString('hex')}.${salt}`;
};

export const compareStringsAndHash = async (suppliedString: string, storedHashAndSalt: string): Promise<boolean> => {
  if (!suppliedString || !storedHashAndSalt) {
    throw new Error('Missing input: Both the supplied string and the stored hash must be provided.');
  }

  const parts: string[] = storedHashAndSalt.split('.');

  if (parts.length !== HASH_PARTS_COUNT) {
    throw new Error('Invalid stored hash format: Expected "hash.salt" format.');
  }

  const [storedHashedString, salt] = parts;

  const storedHashedBuffer: Buffer = Buffer.from(storedHashedString, 'hex');

  const suppliedHashedBuffer: Buffer = (await scryptAsync(suppliedString, salt, KEY_LENGTH)) as Buffer;

  return timingSafeEqual(storedHashedBuffer, suppliedHashedBuffer);
};
