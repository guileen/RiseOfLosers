
;(function(exports,undefined){
	var ns=exports.ROL;


ns.Game=ns.newClass({
	
	container : null ,
	width : 640,
	height : 480,
	viewWidth : null,
	viewHeight : null,
	
	FPS : 60 ,
	resList : null,

	uiPool : null ,
	
	state : null ,
	sceneIndex : 0 ,
	currentScene : null,

	loader : null ,

	beforeLoad : ns.noop ,	


	load : function(force){
		
		if (this.beforeLoad(force)===false){
			return false;
		}	
		var resList=[].concat(this.resList);
		
		this.loader=new ns.ResLoader();

		if (this.loader!=null){
			var resCache=this.loader.load(resList, 
				this._onLoad.bind(this), 
				this._onLoading.bind(this) );
			for (var id in resCache){

				ns.ResPool.addRes(id, resCache[id]);
			}
		}
	},
	_onLoading : function(loadedCount,totalCount,res){
		return this.onLoading(loadedCount,totalCount,res);
	},
	_onLoad : function(loadedCount,totalCount){

		this.onLoad=this.onLoad===ns.noop?this.ready:this.onLoad;
		return this.onLoad(loadedCount,totalCount);
	},
	onLoading : ns.noop,
	onLoad : ns.noop,

	initBaseUI : function(){

		this.initContainer();
		this.initMask();

		this.viewWidth=this.viewWidth||this.width;
		this.viewHeight=this.viewHeight||this.height;
	
		this.uiPool=ns.$id(this.uiPool)||document.body;
		if ( this.uiPool!=document.body ){
			this.uiPool.style.display="none";
		}

	},

	initContainer : function(){
		this.container=ns.$id(this.container)||this.container;
		if (!this.container){
			this.container=document.createElement("div");
			document.body.appendChild(this.container);
		}		
		var domStyle=this.container.style;
		ns.merger(domStyle,{
			position : "relative" ,
			overflow : "hidden" ,		
			padding : "0px" ,
			width : this.width+"px" ,
			height : this.height+"px"
		});	

		


	},
	initMask : function(){
		
		this.mask=document.createElement("div");
		this.container.appendChild(this.mask);
		ns.merger(this.mask.style,{
			position : "absolute" ,
			overflow : "hidden" ,	
			zIndex : 30000 ,
			padding : "0px" ,
			top : "0px",
			left : "0px",
			display : "none",
			//backgroundColor : "rgba(100,100,100,0.5)",
			width : this.width+"px" ,
			height : this.height+"px"
		});	
		try {
			this.mask.style.backgroundColor="rgba(100,100,100,0.5)";
		}catch(e){
			this.mask.style.backgroundColor="#999999";
		}
	},

	initViewport : function(){
		
		if (!this.viewport){
			this.viewport=document.createElement("div");
			this.container.appendChild(this.viewport);		
		}
		var domStyle=this.viewport.style;
		ns.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			overflow : "hidden" ,	
			padding : "0px" ,
			width : this.viewWidth+"px" ,
			height : this.viewHeight+"px" ,
			//backgroundColor : "#fff",
			visibility : "hidden" 
		});

		this.viewport.style.visibility="visible";			
	
	},

	initCanvas : function(){
	
		this.canvas=document.createElement("canvas");

		var domStyle=this.canvas.style;
		ns.merger(domStyle,{
			position : "absolute" ,
			left : "0px",
			top : "0px",
			zIndex : 11
		});

		this.canvas.width=this.viewWidth;
		this.canvas.height=this.viewHeight;
		this.context=this.canvas.getContext('2d');
		this.viewport.appendChild(this.canvas);
	
	},
	
	initUI : function(){
		
	},

	bindUIEvent : function(){
		
	},
	
	
	beforeInit : ns.noop ,	

	zoom : 1 ,
	setZoom : function(zoom){
		zoom=zoom||1;
		this.zoom=zoom;
		this.viewport.style.width=this.viewWidth/zoom+"px";
		this.viewport.style.height=this.viewHeight/zoom+"px";

		this.viewport.style[ns.css.transformOrigin]="left top";
		this.viewport.style[ns.css.transform]="scaleX("+zoom+") scaleY("+zoom+")";

		// this.canvas.width=this.viewWidth;
		// this.canvas.height=this.viewHeight;
		// this.canvas.style.width=this.viewWidth*zoom+"px";
		// this.canvas.style.height=this.viewHeight*zoom+"px";
		// if (this.currentScene){
		// 	this.currentScene.map.scrolled=true;
		// }
	},

	init : function(){
		
		this.initBaseUI();
		this.initUI();
		this.bindUIEvent();

		if (this.beforeInit()===false){
			return false;
		}
					
		if (this.FPS){
			this._sleep=Math.floor(1000/this.FPS);
		}	

		this.scenes=[];

		var Me=this;
		this.callRun = function(){
			Me.run();
		}

		this.onInit();
	},

	ready : function(){
		
		this.pos=this.container.getBoundingClientRect();

		this.initViewport();
		this.initCanvas();	
		this.initEvent();
		this.onReady();
	},
	onReady : ns.noop,

	onInit : ns.noop ,
	initEvent : ns.noop ,

	start : function(){
		this.sceneIndex=0;
		this.restart();		
	},
	restart : function(){	
		this.stop();
		this.sceneIndex=this.sceneIndex||0;
		this.createScene(this.sceneIndex);
		this.activeScene(this.sceneIndex);
		this.play();		
	},	
	activeScene : function(idx){
		this.sceneIndex=idx;
		this.currentScene=this.scenes[idx];
		this.currentScene.init(this);
	
	},	
	createScene : function(idx){
		var scene=this.getSceneInstance(idx);
		scene.index=idx;
		this.scenes[idx]=scene;
		return scene;
	},
	getSceneInstance : ns.noop ,	

	
	play : function(){
		if (!this.currentScene){
			return false;
		}
		this.currentScene.beforeRun(this);	
		this._playing=true;		
		this.timer=(new ns.Timer()).start();
		this.run();
	},
	pause : ns._TODO_,
	resume : ns._TODO_,
	exit : ns._TODO_,
	gameover : ns._TODO_,
	finished : ns._TODO_,

	
	
	run : function(){
		if (this._playing) {
			if (this.logger){
				this.logger.frameCount++;
			}

			this.mainLoop=setTimeout( this.callRun, this._sleep );
			this.timer.tick();
			var deltaTime=this.timer.deltaTime;
			if (this.pausing){
				this.onPausing(deltaTime);
			}else if ( deltaTime>1 ){
				this.timer.runTasks();
				this.update(deltaTime);
				this.clear(deltaTime);
				this.render(deltaTime);
			}
			this.timer.last=this.timer.now;

			this.handleInput(deltaTime);

		}else{
			this.stop();
		}

	},
	onPausing : ns.noop,
	
	
	beforeUpdate : ns.noop ,
	update : function(deltaTime){
		if (this.beforeUpdate(deltaTime)===false){
			return;
		}
		this.currentScene.update(deltaTime);
		this.currentScene.handleInput(deltaTime);		
		this.onUpdate(deltaTime);
	},
	onUpdate : ns.noop ,	
	
	clear : ns.noop ,

	render : function(deltaTime){
		this.currentScene.render(deltaTime);
	},

	handleInput :  ns.noop ,
	
	stop : function(){
		this._playing=false;
		this.pausing=0;
		if (this.mainLoop){
			clearTimeout(this.mainLoop);
		}
		if (this.currentScene){
			this.currentScene.destroy(this);
			this.scenes[this.sceneIndex]=null;
			this.currentScene=null;
		}		
		this.onStop();
	},
	onStop : ns.noop ,
	
	destroy : ns.noop
	
});


})(this);
