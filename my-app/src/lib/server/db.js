import Database from 'better-sqlite3';//import sqlite from "better-sqlite3";
import { DATABASE} from "$lib/shared/constants.js"

console.log("opening "+DATABASE);  //TODO switch db between production & dev
export const db =new Database(DATABASE);
db.pragma('journal_mode = WAL')
//export const db = sqlite(":memory:");


db.exec(`CREATE TABLE IF NOT EXISTS user (
    id INTEGER NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
)`); //id TEXT NOT NULL PRIMARY KEY,

db.exec(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
)`);

export function createUser(username,pwhash){
    const stmt = db.prepare('Update user SET username=?, password_hash=? where (username=?)');
    let info = stmt.run(username,pwhash,username);
    let rowID=(info.changes<=0)?-1:info.lastInsertRowid;;
    if(info.changes<=0) {
        const stmt2 = db.prepare('Insert Into user (username,password_hash) VALUES(?,?)');
        const info = stmt2.run(username,pwhash);
        rowID = (info.changes<=0)?-1:info.lastInsertRowid;
    } 
    return(rowID);
}
export function findUser(username){
    let results = [];
    const stmt = db.prepare('SELECT id,password_hash FROM user '+ 
        'WHERE username=? ');
    const rows = stmt.all(username);
    rows.forEach((row)=>{				
        //results.push(new Tag(row.ID,row.Name));   classes not compatible with devalue?
        results.push({ id:row.id, passwordHash: row.password_hash });
    });
    return(results);
}
export function deleteSession(sessionid){
    const stmt = db.prepare("DELETE FROM session WHERE id = ?");
    let info = stmt.run(sessionid);
}
export function findSession(sessionid){
    let results = [];
    const stmt = db.prepare('SELECT session.id, session.user_id, session.expires_at, user.username FROM session INNER JOIN user ON user.id = session.user_id WHERE session.id = ?');
    const rows = stmt.all(sessionid);
    rows.forEach((row)=>{				
        //results.push(new Tag(row.ID,row.Name));   classes not compatible with devalue?
        results.push({ id:row.id, user_id: row.user_id, expires_at:row.expires_at, username:row.username});
    });
    return(results[0]);
}