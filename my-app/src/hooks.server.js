import {generateSessionToken,createSession,validateSessionToken,invalidateSession,createBlankSessionCookie} from '$lib/server/auth.js';
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import { userJoin,userLeave } from '$lib/server/users';
import { log } from '$lib/server/utils';
import { nanoid } from 'nanoid';
import {sessionCookieName} from '$lib/shared/constants';

// This can be extracted into a separate file
let wssInitialized = false;
const startupWebsocketServer = () => {
  if (wssInitialized) return;
  console.log('[wss:kit] setup');
  const wss = (globalThis)[GlobalThisWSS];//(globalThis as ExtendedGlobal)[GlobalThisWSS];
  if (wss !== undefined) {
    wss.on('connection', (ws, _request) => {
      // This is where you can authenticate the client from the request
      const session = _request.headers.cookie; //userid=... //getSessionFromCookie(request.headers.cookie || '');
      const protocoll = ws.protocol; //"lobby"
      if (!session) ws.close(1008, 'User not authenticated');
      console.log(`[wss:kit] client connected (${ws.socketId})`);
      let clients=wss.clients;
      userJoin(ws,session,"lobby");
	  //function foo(){
    //  ws.send(`Hello_ from SvelteKit ${new Date().toLocaleString()} (${ws.socketId})]`);
    //}
	  //setInterval(foo, 1000)
      ws.on('close', () => {
        userLeave(ws);
        console.log(`[wss:kit] client disconnected (${ws.socketId})`);
      });
    });
    wssInitialized = true;
  }
};

export const handle = (async ({ event, resolve }) => {
  startupWebsocketServer();
  // Skip WebSocket server when pre-rendering pages
  if (!building) {
    const wss =(globalThis)[GlobalThisWSS];//const wss = (globalThis as ExtendedGlobal)[GlobalThisWSS];
    if (wss !== undefined) {
      event.locals.wss = wss;
    }
  }
  const sessionId = event.cookies.get(sessionCookieName);
	if (!sessionId) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
    const { session, user } = await validateSessionToken(sessionId);
    // if (session && session.fresh) {
    //   const sessionCookie = lucia.createSessionCookie(session.id);
    //   event.cookies.set(sessionCookieName, sessionCookie.value, {
    //     path: ".",
    //     ...sessionCookie.attributes
    //   });
    // }
    /*if (!session) {
      const sessionCookie = createBlankSessionCookie();
      event.cookies.set(sessionCookieName, sessionCookie.value, {
        path: ".",
        ...sessionCookie.attributes
      });*/
    //}
    event.locals.user = user;
    event.locals.session = session;
  }
  const response = await resolve(event, {
		filterSerializedResponseHeaders: name => name === 'content-type',
	});
  return response;
});// satisfies Handle;

export const handleError/*: HandleServerError*/ = async ({ event, error, message, status }) => {
  const errorId = nanoid();
  const isNotFound = status === 404;

  if (isNotFound) {
      log.error(`Unhandled not found error (${errorId}):\n`, error);
  }
  else {
      log.fatal(`Uncaught error (${errorId}):\n`, error);
      //if (!dev) {
          log.fatal(`Associated request (${errorId}):\n`, event.request);
      //}
  }

  /*const errorMessage = status === 500 ?
      `Error interno del servidor. Id: ${errorId}` :
      isNotFound ?
          `No se encontro el recurso solicitado. Id: ${errorId}` :
          message;
*/
  return {
      id: errorId,
      message: message,
  };
};
/* TODO
const handleAuth = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get(auth.sessionCookieName);
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSessionToken(sessionToken);
	if (session) {
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
	} else {
		auth.deleteSessionTokenCookie(event);
	}

	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};

export const handle = handleAuth;*/
