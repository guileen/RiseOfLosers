
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

				});
				this.map.init(this.game);
			},

			beforeRun : ROL.noop,

			update : function(deltaTime){
				// console.log("deltaTime ",deltaTime);
			},

			render : function(deltaTime){
				// console.log("context ", this.context);
			},

			handleInput : ROL.noop,

			destroy : ROL.noop
		};

		return cfg;
	},

	null

]
