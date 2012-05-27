
console.log(ROL)


// /api/user, 
// 		{"username":"fins","id":"2"}

// /api/player, 
// 		{"id":"2","name":"fins","avatar":"undefined","pos":"1","money":"5000","exp":"0","level":"1","reputation":"0","moral":"100"}

// /api/city/:id, 
// 		{"id":2,"name":"上海","nodes":[{"id":1,"name":"上海火车站"},{"id":2,"name":"人民广场"}]}


// /api/node/:id/goods?detail=1  //detail=1 表示有详细信息
// /api/good/:id,		{"id":2,"name":"hiPhone 4S"} 
// 
// /api/goods/mget?ids=1,2,3 

ROL.rest = new RestClient({
   // params: {access_token: 'token', client_id: 'client_id'},
   headers: {Accept: 'application/json'},
   timeout: 3000
});

var game=new ROL.Game({

	width : 750 ,
	height : 500 ,
	FPS : 30 ,

	rest : ROL.rest ,

	container : "container" ,
	
	resList : [	
		{ fn : function(cb){

				game.rest.get('/api/player',  function(err, data, res) {
					console.log(err);
					if (!err){
						Datastore.player=data;
						console.log('/api/player',data)
						var cityId=data.city;
						game.rest.get('/api/city/'+cityId,  function(err, data, res) {
								console.log(err)
								if (!err){
									Datastore.city=data;
									Datastore.placeList=data.nodes;
									console.log('/places/',data.nodes)
									game.rest.get('/game/data/map1.json',  function(err, data, res) {
											console.log(err)
											if (!err){
												Datastore.nodeList=data;
												console.log("map1.json",data)
										   		cb(true);
											}
										});
								}
							});
					}
				});
			}
		},
		// { fn : function(cb){
		// 		game.rest.get('/api/player',  function(err, data, res) {
		// 			if (!err){
		// 				Datastore.player=data;
		// 				console.log(data)
		// 		   		cb(true);
		// 			}
		// 		});
		// 	}
		// },
		// 
		// { fn : function(cb){
		// 		game.rest.post('/login', {user:'user', pass: 'pass'}, function(err, data, res) {
		// 	   		cb(true);
		// 		});
		// 	}
		// },
		// { fn : function(cb){
		// 		game.rest.post('/login', {user:'user', pass: 'pass'}, function(err, data, res) {
		// 	   		cb(true);
		// 		});
		// 	}
		// },
		{ id : "player" , src : "./res/player.png" },
		{ id : "defalut-place" , src : "./res/defalut-place.png" },
	].concat(mapImgList),

	beforeLoad : function(){
		$id("login").style.display="none";

		$id("loading").style.display="block";
	},

	onLoading : function(loadedCount,totalCount,res){
		$id("loading-bar").style.width=Math.round(loadedCount/totalCount*100)+"%";
		//return 10;
	},

	onLoad : function(loadedCount,totalCount){
		var Me=this;
		setTimeout(function(){
			$id("loading").style.display="none";
			$id("home").style.display="none";
			Me.ready();
		},1000);
		
	},
	onInit : function(){
		$id("home").style.display="block";
		$id("login").style.display="block";

	},
	onReady : function(){
		this.start();
		$id("UserInfo").style.display="block";
		// this.setZoom(0.75);
	},

	hideQuickBar : function(){
		$id("quickbar").style.display="none";
	},
	showQuickBar : function(x,y){
		x=x-this.currentScene.map.x
		y=y-this.currentScene.map.y
		x-=50;
		y+=50;
		$id("quickbar").x=x||0;
		$id("quickbar").y=y||0;
		$id("quickbar").style.left=x+"px"
		$id("quickbar").style.top=y+"px"
		$id("quickbar").style.display="block";
	},
	initEvent : function(){
		var Me=this;
		ROL.addEvent( this.container , "click", function(evt){
			var x= evt.pageX- game.pos.left;
			var y= evt.pageY- game.pos.top;
			x/=Me.zoom;
			y/=Me.zoom;

			if (Me.currentScene){
				var scene=Me.currentScene;
				var map=scene.map;
				var finder=scene.finder;
				x+=map.x;
				y+=map.y;
				var node=finder.getNodeByPos(x,y);
				if (node){
					console.log("click" , node.id)
				}
				var node=scene.getNodeByPos(x,y);
				if (node){

					var player=scene.player;

					if(!player.moving && !player.toNode && player.currentNode!=node){
						player.toNode=node;
						
						game.rest.get('/api/goto/'+player.toNode.id, function(err,data,res){
							
							if (!err){
								game.hideQuickBar();
								var path = finder.search(player.currentNode, player.toNode);
								player.setPath(path);
							}else{
								console.log("goto",err);
							}
						});

						
					}
				}

			}
			// alert([x,y])
		});

		createController(this);
	},

	getSceneInstance : function(idx){
		var data={
			nodeList : Datastore.nodeList,
			placeList : Datastore.placeList,
			player : Datastore.player,
			map : Datastore.map
		}
		var scene= new ROL.Scene( 
				SceneConfig[idx](data) 
			);
		return scene;
	}

});

ROL.addEvent(window, "load", function(){

	game.init();
	$id("username").focus();
	setTimeout(function(){

		doLogin();
		
	},10)
});
