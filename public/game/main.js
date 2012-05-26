
console.log(ROL)

var game=new ROL.Game({

	width : 750 ,
	height : 500 ,
	FPS : 30 ,

	container : "container" ,
	
	resList : [	
		{ id : "player" , src : "./res/player.png" },
	].concat(mapImgList),

	onLoading : function(loadedCount,totalCount,res){
		//console.log(loadedCount,totalCount);
		return //100;
	},

	onLoaded : function(loadedCount,totalCount){
		console.log(loadedCount,totalCount);
		this.init();
	},

	onInit : function(){
		this.start();
	},
	initEvent : function(){
		var Me=this;
		ROL.addEvent( this.container , "click", function(evt){
			var x= evt.pageX- game.pos.left;
			var y= evt.pageY- game.pos.top;

			if (Me.currentScene){
				var scene=Me.currentScene;
				var map=scene.map;
				var finder=scene.finder;
				x+=map.x;
				y+=map.y;
				var node=finder.getNodeByPos(x,y);
				if (node){
					var player=scene.player;
					if (!player.currentNode && !player.toNode){
						player.setNode(node);
					}else if (!player.toNode){
						player.toNode=node;
					}

					if(player.currentNode && player.toNode){
						alert(player.toNode.id)
						var path = finder.search(player.currentNode, player.toNode);
						player.setPath(path);
					}
				}

			}
			// alert([x,y])
		});

		createController(this);
	},

	getSceneInstance : function(idx){
		var scene= new ROL.Scene( 
				SceneConfig[idx]() 
			);
		return scene;
	}

});

ROL.addEvent(window, "load", function(){

	game.load();
});
