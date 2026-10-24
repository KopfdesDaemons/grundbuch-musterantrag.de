const isBuildRouteExtraction = import.meta.url.includes('/.angular/prerender-root/');

export const JWT_SECRET: string = process.env['JWT_SECRET'] || '';
if (!JWT_SECRET && !isBuildRouteExtraction) console.warn('⚠️ JWT_SECRET ist nicht definiert');

export const DASHBOARD_ROOT_PASSWORD: string = process.env['DASHBOARD_ROOT_PASSWORD'] || '';
if (!DASHBOARD_ROOT_PASSWORD && !isBuildRouteExtraction) console.warn('⚠️ DASHBOARD_ROOT_PASSWORD ist nicht definiert');

export const DASHBOARD_ROOT_USER: string = process.env['DASHBOARD_ROOT_USER'] || '';
if (!DASHBOARD_ROOT_USER && !isBuildRouteExtraction) console.warn('⚠️ DASHBOARD_ROOT_USER ist nicht definiert');

export const IS_PRODUCTION: boolean = process.env['NODE_ENV'] === 'production';
if (!process.env['NODE_ENV'] && !isBuildRouteExtraction) console.warn('⚠️ NODE_ENV ist nicht definiert');
