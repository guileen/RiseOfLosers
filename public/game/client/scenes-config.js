
var mapImgList=[];

(function(){

	for (var y=1;y<=6;y++){
		for (var x=1;x<=8;x++){
			var res={
				id : "tile_"+x+"_"+y,
				src : "./res/tiles/x"+x+"y"+y+".jpg"
			}
			mapImgList.push(res);
		}	
	}


}());



var SceneConfig =[

	function(){

		var cfg={
			onInit : function(){
				this.context=this.game.context;
				this.map=new ROL.Map({
					width : 2048,
					height : 1536,
				});
				this.map.init(this.game);

				this.finder=new ROL.PathFinder();
				this.finder.init(nodeList);

				this.player=new ROL.Player({
					x : 100 ,
					y : 100 ,
					baseX : 70,
					baseY : 70,
					img : ROL.ResPool.getRes("player")
				});
				this.player.init();

			},
			
			scrollBy : function(dx,dy){
				var x=this.map.x+dx;
				var y=this.map.y+dy;
				this.map.setPos(x,y);
			},

			beforeRun : ROL.noop,

			update : function(deltaTime){
				// console.log("deltaTime ",deltaTime);
				this.player.update(deltaTime);
				// console.log(this.player.x,this.player.y)
			},

			render : function(deltaTime){
				var context=this.context;

				this.map.render(deltaTime);
				
				var x=this.map.x;
				var y=this.map.y;

				context.clearRect(0,0,this.map.viewWidth, this.map.viewHeight);
				context.save();
				context.translate(-x,-y);
				this.finder.drawConnLines(context);
				this.finder.drawNode(context);
				
				this.player.render(deltaTime,context);

				context.restore();

				// console.log("context ", context);
			},

			handleInput : ROL.noop,

			destroy : ROL.noop
		};

		return cfg;
	},

	null

]
