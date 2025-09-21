import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'server/config/env.config';
import { AuthError } from 'server/models/errors/auth-error.model';
import { User } from 'server/models/user.model';

export const login = async (user: User, password: string): Promise<string> => {
  const passwordIsCorrect = await user.comparePassword(password);
  if (!passwordIsCorrect) throw new AuthError('Ungültige Anmeldedaten', 401);

  // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
  return sign({ userID: user.userID }, JWT_SECRET, { expiresIn: '21d' });
};

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return reject(new AuthError('Token ungültig', 401));
      }
      resolve(payload as JwtPayload);
    });
  });
};
