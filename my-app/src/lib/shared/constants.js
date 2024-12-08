/*export const BASE_API_URI = import.meta.env.DEV
	? import.meta.env.VITE_BASE_API_URI_DEV
	: import.meta.env.VITE_BASE_API_URI_PROD;

export const BASE_URI = BASE_API_URI.split('/api')[0];

export const BASE_URI_DOMAIN = BASE_API_URI.split('//')[1].split('/api')[0];
*/
import { env } from '$env/dynamic/private'; //settings imported from .env file

export const DATABASE=env.DATABASE;
export const sessionCookieName="mySessionCookie";//TODO why is cookie undefined with "auth_session";
