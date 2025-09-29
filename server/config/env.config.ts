export const JWT_SECRET: string = process.env['JWT_SECRET'] || '';
if (!JWT_SECRET) console.warn('⚠️ JWT_SECRET ist nicht definiert');

export const DASHBOARD_ROOT_PASSWORD: string = process.env['DASHBOARD_ROOT_PASSWORD'] || '';
if (!DASHBOARD_ROOT_PASSWORD) console.warn('⚠️ DASHBOARD_ROOT_PASSWORD ist nicht definiert');

export const DASHBOARD_ROOT_USER: string = process.env['DASHBOARD_ROOT_USER'] || '';
if (!DASHBOARD_ROOT_USER) console.warn('⚠️ DASHBOARD_ROOT_USER ist nicht definiert');

export const IS_PRODUCTION: boolean = process.env['NODE_ENV'] === 'production';
if (!process.env['NODE_ENV']) console.warn('⚠️ NODE_ENV ist nicht definiert');
