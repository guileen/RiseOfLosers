
;(function(exports,undefined){
	var ns=exports.ROL;

	var Player=ns.Player=function(cfg){	

		for (var property in cfg ){
			this[property]=cfg[property];
		}

	};


Player.prototype={
	id :null,
	username :null,
	name :null,

	constructor : Player ,

	workable : false ,
	lastX : -100,
	lastY : -100,
	lastWorkable : false,

	vx : 0,
	vy : 0,
	ax : 0,
	ay : 0,
	dx : 0,
	dy : 0,

	speed : 0.15 ,

	// fromNode : null,
	toNode : null,
	currentNode : null,

	init : function(){

		this.baseX=130
		this.baseY=130

		this.anim1=new ns.Animation({
			img : ROL.ResPool.getRes("player"),
			// img : "player" ,
			getFramesConfig : function(){
				return   [
					{x : 0, y : 0, w : 260, h : 260, duration : 100},
					{x : 260, y : 0, w : 260, h : 260, duration : 100}
				]
			}
			

		});
		this.anim1.init();
		this.anim1.setFrame(0);

		this.anim2=new ns.Animation({
			img : ROL.ResPool.getRes("player-move"),
			// img : "player" ,
			getFramesConfig : function(){
				return   [
					{x : 0, y : 0, w : 260, h : 260, duration : 100},
					{x : 260, y : 0, w : 260, h : 260, duration : 100},
					{x : 520, y : 0, w : 260, h : 260, duration : 100},
					{x : 780, y : 0, w : 260, h : 260, duration : 100},

				]
			}
			

		});
		this.anim2.init();
		this.anim2.setFrame(0);

		this.path=this.path||[];
		var last=this.last={
			vx : 0,
			vy : 0,
			ax : 0,
			ay : 0,
			dx : 0,
			dy : 0
		};

	},
	update : function(deltaTime){
		this.lastX=this.x;
		this.lastY=this.y;
		this.updateMotion(deltaTime);	
		this.updatePath(deltaTime);
		if (this.target){
			this.updatePos();
		}
		this.checkPoint();

		if (this.moving){
			this.anim=this.anim2;
		}else{
			this.anim=this.anim1;

		}
		
		this.anim.update(deltaTime)
	},

	updateMotion : function(deltaTime){
		var last=this.last;
		last.vx=this.vx;
		last.vy=this.vy;

		this.vx=this.vx + this.ax * deltaTime;
		this.vy=this.vy + this.ay * deltaTime;

		last.dx=this.dx;
		last.dy=this.dy;

		this.dx=(last.vx + this.vx) * deltaTime / 2 ; 
		this.dy=(last.vy + this.vy) * deltaTime / 2 ;	
		

	},

	setNode : function(node){
		// this.fromNode=node;
		this.currentNode=node;
		this.toNode=null;
		this.x=node.pos[0];
		this.y=node.pos[1];

	},

	setPos : function(x,y){
		this.x=x;
		this.y=y;
	},

	updatePos : function(){
		this.x+=this.dx;
		this.y+=this.dy;
	},
	updateVelocity : function(targetX, targetY){
		var dx=targetX-this.x;
		var dy=targetY-this.y;


		var rad=Math.atan2( dy , dx );
		var vx= this.speed * Math.cos(rad);
		var vy= this.speed * Math.sin(rad);
		this.vx=vx;
		this.vy=vy;

	},
	checkPoint : function(){
		var pos=this.getNextPoint();
		if ( pos && this.target==null){	
			var x=pos[0],
				y=pos[1];
			this.target=pos;
			this.updateVelocity(x, y);
			this.moving=true;
		}

		if(!pos && this.toNode  && this.moving){
			console.log("arr 1")
			this.onArrive(this.toNode);
		}
	},
	onArrive : function(node){
		var Me=this;
		ROL.rest.get('/api/node/'+node.id+'/goods?detail=1',  function(err, data, res) {
			console.log(data)
			if (!err){
				for (var id in data){
					var good=data[id];

				}
				node.data=data;
				game.showQuickBar(node.pos[0],node.pos[1]);
			}else{
				console.log("goods",err);
			}

			Me.setNode(node);
			Me.moving=false;

		});
	},

	getNextPoint : function(){
		var p=this.path[0];
		return p?p.pos:null;
	},

	setPath : function(path){
		this.path=path;
		this.target==null;
		this.vx=0;
		this.vy=0;
		this.dx=0;
		this.dy=0;
	},

	updatePath : function(deltaTime){
		
		if (this.target!=null){
			
			var dx=this.target[0]-this.x,
				dy=this.target[1]-this.y;
			

			if (dx*this.dx >=0){
				if (Math.abs(this.dx)>Math.abs(dx) ){
					this.dx=0//dx;
					this.x=this.target[0];
					this.vx=0;
				}
			}
			if (dy*this.dy >=0){
				if (Math.abs(this.dy)>Math.abs(dy) ){
					this.dy=0//dy;
					this.y=this.target[1];
					this.vy=0;
				}
			}
			if (!this.vx && !this.vy){	
				if (this.path[0] && this.target===this.path[0].pos){
					this.path.shift();
				}		
				this.target=null;
			}
		}

		return !this.target;
	},


	render : function(deltaTime, context){

		if (this.path.length){
			drawFoundPath(context,this.pathForDraw,"#cc0000");
		}else{
			//Game.drawBg();
		}

		if (this.targetForDraw){
			var c=this.targetForDraw;
			drawCircle(context,c[0],c[1],c[2],c[3] );
		}
	

		context.save();

		context.translate(this.x,this.y);
		var anim=this.anim;
		var f=anim.currentFrame;
		var img=anim.img;
		var iX=f.x , iY=f.y, iW=f.w, iH=f.h , w=f.w, h=f.h ;
// console.log(iX,iY,iW,iH, 0,0, w, h)
		var dx=this.x-this.lastX;
		if (dx>1){
			context.scale(-1,1);
		}else{
			
		}
		context.translate(-this.baseX,-this.baseY);
		context.drawImage(img,iX,iY,iW,iH, 0,0, w, h);

		// context.drawImage(anim.img, 0,0,f.w,f.h,f.x,f.y,f.w,f.h);

		
		context.restore();
	}
};


}(exports));



