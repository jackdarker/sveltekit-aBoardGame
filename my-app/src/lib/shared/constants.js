import { building } from '$app/environment'
import { env } from '$env/dynamic/private'; //settings imported from .env file

export const DATABASE= building ? "fallback" : env.DATABASE;	//hack causes issue in build otherwise
export const sessionCookieName="mySessionCookie";//TODO why is cookie undefined with "auth_session";
