
;(function(exports,undefined){
	var ns=exports.ROL;

	var Player=ns.Player=function(cfg){	

		for (var property in cfg ){
			this[property]=cfg[property];
		}

	};


Player.prototype={
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

	speed : 0.08 ,

	fromNode : null,
	toNode : null,
	currentNode : null,

	init : function(){

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
		this.fromNode=node;
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
			this.currentNode=null;
		}else if(this.toNode){
			//this.setNode(this.toNode);
			
		}
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
		context.translate(this.x-this.baseX,this.y-this.baseY);
		context.drawImage(this.img, 0,0);
		context.restore();
	}
};


}(exports));



