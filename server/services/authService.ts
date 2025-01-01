import * as jwt from 'jsonwebtoken';

const DASHBOARD_PASSWORD = 'DASHBOARD_LOGIN_PASSWORD';

export const authenticateUser = async (username: string, password: string): Promise<string> => {
    const secretKey: string | undefined = process.env[DASHBOARD_PASSWORD];

    if (!secretKey) {
        throw new Error(DASHBOARD_PASSWORD + ' ist nicht definiert');
    }

    if (username !== 'Rico' || password !== secretKey) {
        throw new Error('Ungültige Anmeldedaten');
    }

    // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
    const token = jwt.sign({ username }, secretKey, { expiresIn: '21d' });
    return token;
};

/** 
*   Prüft, ob das Token gültig ist
*   @param token Das zu prüfende Token.
*   @returns username und Generierungszeitpunkt und Ablauffzeitpunkt  
*/
export const verifyToken = async (token: string): Promise<any> => {
    const secretKey: string | undefined = process.env[DASHBOARD_PASSWORD];

    if (!secretKey) {
        throw new Error(DASHBOARD_PASSWORD + ' ist nicht definiert');
    }

    return new Promise((resolve, reject) => {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return reject(new Error('Token ungültig'));
            }

            resolve(user);
        });
    });
};
