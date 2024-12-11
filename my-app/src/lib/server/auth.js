import { db,deleteSession,findSession } from "./db.js";
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import {sessionCookieName} from '$lib/shared/constants';

export async function actLogout(event) {
    if (!event.locals.session) {
        return fail(401);
    }
    await invalidateSession(event.locals.session.id);
    deleteSessionTokenCookie(event);
    //return redirect(302, '/demo/lucia/login');
}


export function generateSessionToken()/*: string */{
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export function createSession(token/*: string*/, userId/*: number*/)/*: Session*/ {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session/*: Session*/ = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	const stmt = db.prepare("INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)");
    let info = stmt.run(session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000));
	return session;
}

export function createBlankSessionCookie(){
	const session/*: Session*/ = {
		id: 0,
		userId:"anonymous",
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	return session;
}
/**
 * @param {import("@sveltejs/kit").RequestEvent} event
 * @param {string} token
 * @param {Date} expiresAt
 */
 export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set(sessionCookieName, token, {
		expires: expiresAt,
		path: '/'
	});
	event.cookies.set("myCookie", token, {
		expires: expiresAt,
		path: '/'
	});
}

/** @param {import("@sveltejs/kit").RequestEvent} event */
export function deleteSessionTokenCookie(event) {
	event.cookies.delete(sessionCookieName, {
		path: '/'
	});
}
export function validateSessionToken(token/*: string*/)/*: SessionValidationResult */{
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = findSession(sessionId);
	if (row === null || row === undefined) {
		return { session: null, user: null };
	}
	const session/*: Session*/ = {
		id: row.id,
		userId: row.user_id,
		expiresAt: new Date(row.expires_at * 1000)
	};
	const user/*: User */= {
		id: row.user_id,
		username: row.username
	};
	if (Date.now() >= session.expiresAt.getTime()) {
		deleteSession(session.id)
		return { session: null, user: null };
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		const stmt = db.prepare("UPDATE session SET expires_at = ? WHERE id = ?");
    	let info = stmt.run(Math.floor(session.expiresAt.getTime() / 1000),
			session.id	);
	}
	return { session, user };
}

export function invalidateSession(sessionId/*: string*/)/*: void*/ {
	deleteSession(sessionId);
}

// export type SessionValidationResult =
// 	| { session: Session; user: User }
// 	| { session: null; user: null };

// export interface Session {
// 	id: string;
// 	userId: number;
// 	expiresAt: Date;
// }

// export interface User {
// 	id: number;
// }

// ....................................................
// import { Lucia } from "lucia";
// import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";
// import { dev } from "$app/environment";
// import { db } from "./db";

// const adapter = new BetterSqlite3Adapter(db, {
// 	user: "user",
// 	session: "session"
// });

// export const lucia = new Lucia(adapter, {
// 	sessionCookie: {
// 		attributes: {
// 			secure: !dev
// 		}
// 	},
// 	getUserAttributes: (attributes) => {
// 		return {
// 			username: attributes.username
// 		};
// 	}
// });