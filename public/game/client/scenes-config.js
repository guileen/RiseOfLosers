
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


function parsePlace(){


}

var SceneConfig =[

	function(data){

		var cfg={

			data : data ,

			initPlaces : function( placeList, nodeMap ){
				var pl=this.placeList=[];

				placeList.forEach(function(place, idx){
					var id=place.id;
					var node=nodeMap[id];
					var p={
						id : id,
						name : place.name,
						img : place.img || "place-"+id,
						node : node
					}
					var place=new ROL.Place(p);
					place.init();
					pl.push(place);
				})

			},

			getNodeByPos : function(x,y){
				var len=this.placeList.length;
				for (var i=0;i<len;i++){
					var place=this.placeList[i];
					var node=place.node;
					var p=node.pos;
					var dx=x-p[0],dy=y-p[1];

					var dis=Math.sqrt( dx*dx+dy*dy);

					if (dis<place.baseX){
						return node;
					}
				}
				return null;
			},

			onInit : function(){
				var data=this.data||{};

				var nodeList=data.nodeList;
				var placeList=data.placeList;
				var player=data.player;
				var map=data.map;

			
				this.map=new ROL.Map( {
					width : map.width,
					height : map.height
				});
				this.map.init(this.game);

				this.finder=new ROL.PathFinder();
				this.finder.init(nodeList);

				this.initPlaces(placeList, this.finder.nodeMap);


				this.player=new ROL.Player(player);
				this.player.img = ROL.ResPool.getRes("player");

				this.player.init();
				$id("money").innerHTML=Math.floor(player.money);
				$id("displayname").innerHTML="大城小胖";//player.name
				var cn=this.finder.getNode(player.node||player.pos);
				if (cn){
					console.log("arr 0")
					this.player.onArrive(cn);
					// console.log(cn.pos)
					setTimeout(function(){
						game.currentScene.scrollTo(cn.pos[0]-200,cn.pos[1]-200);
						game.showQuickBar(cn.pos[0],cn.pos[1])					
					},100)
				}

				

				var Me=this;
				this.placeList.forEach( function(place){
					place.game=Me.game;
					place.init();
				});

				this.context=this.game.context;
			},
			scrollTo : function(x,y){
				this.map.setPos(x,y);
			},

			scrollBy : function(dx,dy){
				var x=this.map.x+dx;
				var y=this.map.y+dy;
				this.map.setPos(x,y);
				var bar=$id("quickbar");
				x=bar.x-(this.map.x-this.map.lastX);
				y=bar.y-(this.map.y-this.map.lastY);
				bar.x=x||0;
				bar.y=y||0;
				bar.style.left=x+"px"
				bar.style.top=y+"px"
			},

			beforeRun : ROL.noop,

			update : function(deltaTime){
				// console.log("deltaTime ",deltaTime);
				this.player.update(deltaTime);
				// console.log(this.player.x,this.player.y)
			},

			render : function(deltaTime){

				// if (!this.map.scrolled &&　!this.player.changed){
				//  	return;
				// }
				var context=this.context;
				this.map.render(deltaTime);
				
				var x=this.map.x;
				var y=this.map.y;

				context.clearRect(0,0,this.map.viewWidth, this.map.viewHeight);

				context.save();
				context.translate(-x,-y);
				// this.finder.drawConnLines(context);
				this.finder.drawNode(context);

				this.placeList.forEach( function(place){
					place.render(deltaTime, context);
				});
				
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
