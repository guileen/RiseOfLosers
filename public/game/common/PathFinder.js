
;(function(exports, undefined){
	var ns=exports.ROL;

	var PathFinder=ns.PathFinder=function(){

	}

	PathFinder.prototype=new AStarSearch();
	
	var PT= {
		
		constructor : PathFinder ,

		nodeList : null ,
		nodeMap : null,
		nodes : null,	

		connLines : null,

		fromNode : null,
		toNode : null ,

		init : function(nodes){
			this.nodes=nodes;

			var nodeList =this.nodeList=[];
			var nodeMap = this.nodeMap={};
			var connLines = this.connLines={};
			

			var Me=this;
			this.nodes.forEach(function(_node,idx){
				var node=Me.createNode(_node);
				nodeMap[_node.id]=node;
				nodeList.push(node);
			});

			
			this.nodeList.forEach(function(node,idx){
				var _conn=node._conn;
				_conn.forEach(function(id){

					var nn=nodeMap[id];
					
					if (!node.conn[id]){
						var dis=Me.getCostH(node,nn);
						node.conn[id]=nn;
						node.connDis[id]=dis;
						if (!nn.conn[id]){
							nn.conn[node.id]=node;
							nn.connDis[node.id]=dis;
						}
					}

					if (!connLines[node.id+"-"+nn.id]
						&& !connLines[nn.id+"-"+node.id]){
						console.log(node.pos , nn.pos)
						connLines[node.id+"-"+nn.id]=[node.pos , nn.pos];
						
					}
					
				});
				delete node._conn;
			});


		},

		getNodeByPos : function(x,y){
			var len=this.nodeList.length;
			for (var i=0;i<len;i++){
				var node=this.nodeList[i];
				var p=node.pos;
				var dx=x-p[0],dy=y-p[1];

				var dis=Math.sqrt( dx*dx+dy*dy);

				if (dis<10){
					return node;
				}
			}
			return null;
		},

		getNode : function(id){
			return this.nodeMap[id];
		},

		start : function(){
			if (this.fromNode && this.toNode){

			}

		},

		createNode : function(_node ){
			var node={
				id : _node.id ,
				pos : [ _node.x, _node.y ],
				_conn : _node.conn,
				conn : {},
				connDis : {}
			};
			return node;
		},


		getStepCost : function(fromNode,toNode){
    		return fromNode.connDis[toNode.id];
    	},

		getCostH : function(node,endNode){
			var dx=node.pos[0]-endNode.pos[0];
			var dy=node.pos[1]-endNode.pos[1];
			return  Math.sqrt(dx*dx+dy*dy);
		},
		isSolution : function(node , endNode){
			//return node === endNode ;
			return node.pos[0]==endNode.pos[0] && node.pos[1]==endNode.pos[1];
		},

		findSuccessors : function(node,openList,closedKeys){
	
			var successors = [];	
			var f = node.f ;
	       	var nns=node.conn;
	      	for (var key in nns){
	      		var nn=nns[key];
	      		successors.push(nns[key]);
	      	}
    		return successors; 
			
		},
		drawNode : function(context){
			this.nodeList.forEach(function(node){
				var p=node.pos;
				context.beginPath();
				context.arc(p[0], p[1], 10, 0, 2 * Math.PI, false);
				context.fillStyle="blue";	
				context.fill();	
				context.closePath();		
			})

		},

		drawConnLines : function(context){

			for (var id in this.connLines){
				var line=this.connLines[id];
				var p1=line[0], p2=line[1];
				context.lineWidth=10;
				context.beginPath();
				context.moveTo( p1[0] ,p1[1] );
				context.lineTo( p2[0] ,p2[1] );
				context.strokeStyle="red"
				context.stroke();
				context.closePath();
			}
		}
	};

	for (var key in PT) {
		PathFinder.prototype[key] = PT[key];
	}
}(exports));
