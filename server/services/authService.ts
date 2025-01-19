import * as jwt from 'jsonwebtoken';
import { getUser } from './userService';
import logger from 'server/config/logger';


const DASHBOARD_PASSWORD = 'DASHBOARD_LOGIN_PASSWORD';



export const login = async (username: string, password: string): Promise<string> => {
    const secretKey: string | undefined = process.env[DASHBOARD_PASSWORD];
    if (!secretKey) {
        throw new Error(DASHBOARD_PASSWORD + ' ist nicht definiert');
    }

    const testUser = getUser(username);

    await testUser.setPasswordHashFromDB(secretKey);

    const passwordIsCorrect = await testUser.comparePassword(password);
    if (!passwordIsCorrect) {
        throw new Error('Ungültige Anmeldedaten');
    } else {
        // Erstelle ein Token mit einer Gültigkeit von 3 Wochen
        const token = jwt.sign({ username: username, userID: testUser.userID }, secretKey, { expiresIn: '21d' });
        return token;
    }
}

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
            logger.info(user);
            resolve(user);
        });
    });
};


