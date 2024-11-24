import * as auth from '$lib/server/auth.js';
import { building } from '$app/environment';
import { GlobalThisWSS } from '$lib/server/webSocketUtils';
import { userJoin,userLeave } from '$lib/server/users';

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
  const response = await resolve(event, {
		filterSerializedResponseHeaders: name => name === 'content-type',
	});
  return response;
});// satisfies Handle;

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
