// src/services/authService.ts
import * as jwt from 'jsonwebtoken';

const SECRET_KEY_ENV_VAR = 'DASHBOARD_LOGIN_PASSWORD';

export const authenticateUser = async (username: string, password: string): Promise<string> => {
    const secretKey: string | undefined = process.env[SECRET_KEY_ENV_VAR];

    if (!secretKey) {
        throw new Error('SECRET_KEY is not defined');
    }

    if (username !== 'Rico' || password !== secretKey) {
        throw new Error('Ungültiger Anmeldeversuch unter dem Nutzernamen ' + username);
    }

    // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
    const token = jwt.sign({ username }, secretKey, { expiresIn: '21d' });
    return token;
};


export const verifyToken = (token: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const secretKey: string | undefined = process.env[SECRET_KEY_ENV_VAR];

        if (!secretKey) {
            return reject(new Error('SECRET_KEY is not defined'));
        }

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return reject(err);
            }
            resolve(user);
        });
    });
};

