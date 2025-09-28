import { Secret, sign, SignOptions, verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'server/config/env.config';
import { AuthError } from 'server/models/errors/auth-error.model';

export const verifyToken = async (token: string): Promise<{ userID: number }> => {
  return new Promise((resolve, reject) => {
    verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return reject(new AuthError('Token ungültig', 401));
      }
      resolve(payload as { userID: number });
    });
  });
};

export const createToken = (payload: object, lifeTime: string): string => {
  return sign(payload, JWT_SECRET as Secret, { expiresIn: lifeTime } as SignOptions);
};
