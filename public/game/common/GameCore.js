
var util = util||require('util');
var DH = DH||require('./Base');
var Person = Person||require('./Person');

module.exports=GameCore;


function GameCore(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


GameCore.prototype={

	constructor : GameCore ,

	personList : null,
	personMap : null ,
	personNameCache : null,

	map : null,
	game : null ,

	server : null ,
	init : function(game){
		this.game=game;
		this.personList=[];
		this.personMap={};
		this.personNameCache={};
		this.map={
			width : 0,
			height : 0
		}
		this.resizeMap();
	},

	addPerson : function(info){
		var id=info[1];
		var name=this.checkName(info[2]);
		var pos=this.getRandomPos();
		var person=new Person({
			id : id,
			name : name,
			map : this.map,
			x : pos[0],
			y : pos[1]
		});
		person.init();
		this.personList.push(person);
		this.personMap[id]=person;
		this.personNameCache[name]=person;

		util.log( name + " come --- player num : "+this.personList.length )
		var resized=this.resizeMap();
	},

	removePerson : function(id){
		var person=this.personMap[id];
		var name ;
		if (person){
			name=person.name;
			for (var i=this.personList.length-1;i>=0;i--){
				var p=this.personList[i];
				if (p==person){
					this.personList.splice(i, 1);
					break;
				}
			}
			delete this.personMap[id];
			delete this.personNameCache[person.name];
		}

		util.log( name + " leave --- player num : "+this.personList.length )

		var resized=this.resizeMap();
	},

	checkName : function(name){
		var i=1;
		var oName=name+"";
		while( this.personNameCache[name] ){
			i++;
			name=oName+"_"+i;
		}
		return name;
	},

	updatePersonMoveInfo : function(info){
		var id=info[1];
		var person=this.personMap[id];
		if (person){
			person.rotationD=info[2];
			person.walk=info[3];
			var raging=info[4];
			if (raging==true && person.power==100 && person.state!=1){
				person.state=1;
			}
		}else{
			if (this.game.server && this.game.server.kick){
				this.game.server.kick(id);
			}
			util.log("err id : "+id);
		}
	},

	syncFlag : 0,
	updateAllPerson : function(deltaTime){
		for (var i=this.personList.length-1;i>=0;i--){
			var p=this.personList[i];
			p.update(deltaTime);
			if (p.state==2){
				p.state=0;
				p.rotation=0;
				var pos=this.getRandomPos();
				p.x=pos[0];
				p.y=pos[1];
				p.power=100;
				p.init();
			}
		}
		this.checkAllPersonAABB();
		this.collideAllPerson();
		// if (this.syncFlag===0){
			this.syncAllPerson();
		// }else{
		// 	this.syncFlag++;
		// 	this.syncFlag=this.syncFlag%2;
		// }
	},

	collideAllPerson : function(){

		var sprites=this.personList;
	    for( var s = 0; s < sprites.length; s++ ) {
			var spriteA = sprites[s];
			var enemyList=spriteA.enemyList;

			for (var i=enemyList.length-1;i>=0;i--){
				var spriteB=enemyList[i];
				var rs=spriteA.collideOther(spriteB);
				enemyList[i]=[
						spriteB.id,
						spriteB.name,
						spriteB.x,
						spriteB.y,
						spriteB.rotation,
						spriteB.state
					];
			}
		}

	},


	checkAllPersonAABB : function(){

		var sprites=this.personList;
		var len=sprites.length;

	    for( var i = 0; i < len; i++ ) {
			var spriteA = sprites[i];
			spriteA.enemyList=[];

			for( var j = 0; j < len; j++ ) {
				var spriteB = sprites[j];
				if( spriteA!=spriteB
					&& spriteA.inAABB(spriteB.x,spriteB.y)  ) {
						spriteA.enemyList.push(spriteB);
				}

			}
		}


	},


	syncAllPerson : function(deltaTime){
		var len=this.personList.length;
		for (var i=len-1;i>=0;i--){
			var p=this.personList[i];
			
			if (this.game.server){
				var viewPoly=DH.roundPoly(p.viewPoly);
				var info=[
					DH.CONST.CMD.sync,
					p.id,
					p.name,
					p.x,
					p.y,
					p.rotation,
					p.state,
					p.power,
					p.doNum,
					p.beDidNum,

					viewPoly,
					
					p.enemyList,
					this.map.width,
					this.map.height,
					p.doing,
					p.diding,
					len

				];
				// util.log(p.id+"---"+p.enemyList.length)
				// util.log(JSON.stringify(info))
				this.game.server.send(p.id , JSON.stringify(info) );
				p.doing=false;
				p.diding=false;
			}
		}
		
	},


	personArea : 400 * 400 ,
	resizeMap : function(){

		var ts= this.personArea * this.personList.length;

		var ns=Math.ceil( Math.sqrt(ts) ) ;
		ns=Math.max(1300,ns);
		if (this.map.width!=ns){
			this.map.width=this.map.height=ns;
			return true;
		}
		return false;
	},	


	getRandomPos : function(){
		return [
			DH.genRandom(5,this.map.width-5),
			DH.genRandom(5,this.map.height-5)
		]
	},




};


