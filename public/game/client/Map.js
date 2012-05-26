
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

	tileWidth : 256 ,
	tileHeight : 256 ,

	width : 2048,
	height : 1536,

	minX : 0,
	minY : 0,

	init : function(game){

		this.viewWidth=game.viewWidth;
		this.viewHeight=game.viewHeight;

		this.mapCols=Math.ceil(this.width/this.tileWidth);
		this.mapRows=Math.ceil(this.height/this.tileHeight);

		this.maxX=this.width-this.viewWidth;
		this.maxY=this.height-this.viewHeight;

		this.setPos(this.x,this.y);

		this.box=document.createElement("div");
		game.viewport.appendChild(this.box);		
		var domStyle=this.box.style;
		ns.merger(domStyle,{
			position : "absolute" ,
			overflow : "hidden" ,	
			padding : "0px" ,
			width : this.width+"px" ,
			height : this.height+"px" ,
			zIndex : 10 ,
			left : "0px",
			top : "0px",
			//backgroundColor : "#fff",
			visibility : "hidden" 
		});

		this.initTiles();

		this.box.style.visibility="visible";			


	},

	initTiles : function(){

		for (var y=1;y<=this.mapRows;y++){
			for (var x=1;x<=this.mapCols;x++){
				var id = "tile_"+x+"_"+y;
				var img=document.createElement("img");
				img.src=ns.ResPool.getRes(id).src;
				img.width=this.tileWidth;
				img.height=this.tileHeight;
				img.style.position="absolute";
				img.style.left=(x-1)*this.tileWidth+"px";
				img.style.top=(y-1)*this.tileHeight+"px";
				this.box.appendChild(img);
			}
		}
	},

	setPos : function(x,y){
		this.x=Math.max(this.minX, Math.min(this.maxX, x));
		this.y=Math.max(this.minY, Math.min(this.maxY, y));
		this.scrolled=true;
	},

	update : function(deltaTime ){
	

	},
	render : function(deltaTime ){
		
		if (this.scrolled){
			ns.setDomPos(this.box, -this.x, -this.y);
			this.scrolled=false;
		}

	}

};


}(exports));


