
const db2 = new Map();
let tiles=[0,0,0,0,0,0,0,0,0];
let players=[];
let currentPlayer;

export function init(params) {
	tiles=[0,0,0,0,0,0,0,0,0];
	players=[{id:params.userid,tile:-1},
		{id:null, tile:1}]
	currentPlayer=0;
}

export function getState() {
	return({tiles:tiles});
}

export function setState(idx,playerid) {
	players.forEach((x,i)=>{
		if(x.id==playerid && i==currentPlayer){
			tiles[idx]=x.tile;
			currentPlayer=(currentPlayer+1)%players.length;

		} 
	})	
	if(currentPlayer==1){	//trigger AI
		setTimeout(() => {
			let choose;
			tiles.forEach((x,i)=>{if(x==0) choose=i;});
			setState(choose,null)
		}, 2000);
	}
}