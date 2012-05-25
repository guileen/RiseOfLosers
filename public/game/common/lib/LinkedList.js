
;(function(scope){

var LinkedList = scope.LinkedList = function(){
	this.head={};
	this.tail={};
	this.clear();
};

var proto={

	length : 0,

	clear : function(){
		this.head._next=this.tail;
		this.tail._prev=this.head;
		this.length=0;
	},

	addNode : function(node){
		node._prev = this.tail._prev;
		node._next = this.tail;
		node._prev._next = this.tail._prev = node;
		this.length++;
	},

	removeNode: function(node){
		node._prev._next = node._next;
		node._next._prev = node._prev;
		node._next = node._prev = null;
		this.length--;
	},

	insertAfter : function(node,afterNode){
		node._prev = afterNode;
		node._next = afterNode._next;
		afterNode._next = node;
		this.length++;
	},

	insertBefore : function(node,beforeNode){
		node._prev = beforeNode._prev;
		node._next = afterNode;
		beforeNode._prev = node;
		this.length++;
	},

	isHead : function(node){
		return node===this.head;
	},
	
	isTail : function(node){
		return node===this.tail;
	},

	first : function(){
		return this.head._next;
	},

	last : function(){
		return this.tail._prev;
	},

	isFirst : function(node){
		return node==this.first();
	},

	isLast : function(node){
		return node==this.last();
	},

	circle : function(){
		this.last()._next=this.first();
	},

	uncircle : function(){
		this.last()._next=this.tail;
	},

	getNodeByIndex : function(index){
		index||0;
		var node=this.first();
		for (i=0;i<index;i++){
			node=node._next;
		}
		return node;
	},
	
	forEach : function(fn){
		var rsList=[];
		var node=this.head;
		for (var i=0,len=this.length;i<len;i++){
			node=node._next;
			if (node==null){
				break;
			}
			var rs=fn(node,i,this);
			rsList.push(rs);
			if (rs===false){
				break;
			}
		}
		return rsList;
	},

	toArray : function(clean){
		var arr=[];
		clean=!!clean;
		this.forEach(function(node){
			arr.push(node);
		});
		if (clean){
			arr.forEach(function(node){
				delete node._prev;
				delete node._next;
			});
		}
		return arr;
	}
};

for (var p in proto){
	LinkedList.prototype[p]=proto[p];
}


}(this));

