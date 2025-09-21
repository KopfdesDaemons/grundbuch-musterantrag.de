import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'server/config/env.config';
import { User } from 'server/models/user.model';

export const login = async (user: User, password: string): Promise<string> => {
  if (!user) {
    throw new Error('Ungültige Anmeldedaten');
  }

  const passwordIsCorrect = await user.comparePassword(password);

  if (!passwordIsCorrect) {
    throw new Error('Ungültige Anmeldedaten');
  } else {
    // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
    return sign({ userID: user.userID }, JWT_SECRET, { expiresIn: '21d' });
  }
};

/**
 *   Prüft, ob das Token gültig ist
 *   @param token Das zu prüfende Token.
 *   @returns username und Generierungszeitpunkt und Ablauffzeitpunkt
 */
export const verifyToken = async (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return reject(new Error('Token ungültig'));
      }
      resolve(payload as JwtPayload);
    });
  });
};
