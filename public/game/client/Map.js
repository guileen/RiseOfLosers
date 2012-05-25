;(function(exports,undefined){
	var ns=exports.ROL;



var Map=ns.Map=function(cfg){	

	for (var property in cfg ){
		this[property]=cfg[property];
	}

};


Map.prototype={

	constructor : Map ,

	x : 0,
	y : 0,

	tileSize : 128 ,

	width : 1200,
	height : 1200,


	init : function(){
		this.viewWidth=this.game.width;
		this.viewHeight=this.game.height;

		this.tileCols=Math.ceil(this.viewWidth/this.tileSize)+2;
		this.tileRows=Math.ceil(this.viewHeight/this.tileSize)+2;
		this.player=this.game.currentStage.player;
	},

	update : function(deltaTime ){

		var x=this.player.x;
		var y=this.player.y;

		var left=x-this.x;
		var right=this.viewWidth-left;
		var top=y-this.y;
		var bottom=this.viewHeight-top;
		if ( right < 300){
			this.x=x-(this.viewWidth-300);
		}
		if ( left < 300){
			this.x=x-300;
		}
		if ( bottom < 250){
			this.y=y-(this.viewHeight-250);
		}
		if ( top < 250){
			this.y=y-250;
		}

		var maxX=this.width-this.viewWidth;
		var maxY=this.height-this.viewHeight;

		this.x=Math.max(0, Math.min(maxX, this.x));
		this.y=Math.max(0, Math.min(maxY, this.y));


	}

};


}(exports));


