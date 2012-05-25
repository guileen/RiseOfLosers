
var SceneConfig =[

	function(){

		var cfg={
			onInit : function(){
				this.context=this.game.context;
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
