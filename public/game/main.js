
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
   timeout: 30
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
					if (!err){
						Datastore.player=data;
						console.log(data)
						var cityId=data.city;
						game.rest.get('/game/data/map1.json',  function(err, data, res) {
							if (!err){
								Datastore.nodeList=data;
						   		cb(true);
							}else{
								console.log(err)
							}
								 console.log(data)
						});
						// return;
						// game.rest.get('/api/city/'+cityId,  function(err, data, res) {
						// 	if (!err){
						// 		Datastore.city=data;
						// 		Datastore.placeList=data.nodes;
						// 		console.log(data)
						//    		game.rest.get('/game/data/map1.json',  function(err, data, res) {
						// 			if (!err){
						// 				Datastore.nodeList=data;
						// 				console.log(data)
						// 		   		cb(true);
						// 			}
						// 		});
						// 	}
						// });
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

	onLoading : function(loadedCount,totalCount,res){
		// console.log(loadedCount,totalCount);
		return //100;
	},

	onLoad : function(loadedCount,totalCount){
		// console.log("onLoad ",loadedCount,totalCount);
		$id("home").style.display="none";
		this.ready();
	},
	onInit : function(){
		$id("home").style.display="block";
	},
	onReady : function(){
		this.start();
		// this.setZoom(0.75);
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
				var node=scene.getNodeByPos(x,y);
				if (node){
					var player=scene.player;
					if (!player.currentNode && !player.toNode){
						player.setNode(node);
					}else if (!player.toNode){
						player.toNode=node;
					}

					if(player.currentNode && player.toNode){
						console.log(player.toNode)
						dui.marketDialog();
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
});
