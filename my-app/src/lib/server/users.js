let users=[];

export function userJoin(ws,name,room){
    userLeave(ws.socketId);
    users.push({ws,name,room});
    ws.send(`Hello ${name} to ${room} ${new Date().toLocaleString()} (${ws.socketId})]`);
}

export function userLeave(ws){
    for(var i=users.length-1;i>=0;i--){
        if(users[i].ws.socketId===ws.socketId){
            users.splice(i,1);
        }
    }
}

/*export function getUserById(id){
    return(users.find(user=>{return(user.id===id);}));
}*/

export function getUsersByRoom(room){
    return(users.filter(user=>{return(user.room===room);}));
}