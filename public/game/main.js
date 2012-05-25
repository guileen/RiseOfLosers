
console.log(ROL)

var game=new ROL.Game({

	width : 750 ,
	height : 500 ,
	FPS : 30 ,

	container : "container" ,
	
	resList : [
		// { id : "player" , url : "./res/person.png" },
		// { id : "flower" , url : "./res/flower.png" },
		// { id : "milk" , url : "./res/milk.png" },
		{ id : "tiles" , url : "./res/tiles.png" }
	],

	onLoading : function(loadedCount,totalCount,res){
		console.log(loadedCount,totalCount);
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

		ROL.addEvent( this.container , "click", function(evt){
			var x= evt.pageX- game.pos.left;
			var y= evt.pageY- game.pos.top;

			alert([x,y])
		});
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
