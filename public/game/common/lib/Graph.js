


;(function(scope){

var Graph = scope.Graph = function(){

	this.clear();
};

var proto={

	count : 0,

	clear : function(){
		this.nodeMap={};
		this.nodeList=[];
		this.count=0;
	},

	addNode : function(node){
		this.nodeMap[node.id]=node;
		node._index=this.nodeList.count;
		this.nodeList.push(node);
		this.count++;
	},

	removeNode: function(node){
		delete this.nodeMap[node.id];
		var idx=node._index;
		this.nodeList.splice(idx, 1);
		this.count--;
	}

};

for (var p in proto){
	Graph.prototype[p]=proto[p];
}


}(this));

