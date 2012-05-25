

;(function(exports, undefined){
	var ns=exports.ROL;

	ns.CONST={};
	ns.CONST.FPS=30;
	ns.CONST.DEG_TO_RAD=Math.PI/180;
	ns.CONST.RAD_TO_DEG=180/Math.PI;
	ns.CONST.DEG_90= 90*ns.CONST.DEG_TO_RAD;

	ns.CONST.CMD={
		login : "i",
		leave : "l",
		sync : "s",
		update : "u",
		err : "e"
	};


	ns.noop=function(){};
	ns._TODO_=function(){};


	ns.merger=function(so, po,override) {
		if (arguments.length<2 || po === undefined ) {
			po = so;
			so = {};
		}
		for ( var key in po) {
			if ( !(key in so) || override!==false ) {
				so[key] = po[key];
			}
		}
		return so;
	};
		

	ns.merger(ns,{

		newClass : function(protoT,superClass){
			var pCon=protoT.constructor;
			var con=(pCon&&pCon!=Object.prototype.constructor)?pCon:function(cfg){
									ns.merger(this, cfg);
								};
			if (superClass){
				con=ns.inherit(con,superClass,protoT);
			}else{
				con.prototype=protoT;
				con.constructor=con;
			}
			return con;
		},
		
		inherit : function(subClass, superClass, prot ) {
			var tmpConstructor = function() {};
			subClass=subClass||function() {};
			prot=prot||{};
			if (superClass){
				tmpConstructor.prototype = superClass.prototype;
				subClass.$SuperClass = superClass.prototype;
			}
			subClass.prototype = new tmpConstructor();
			ns.merger(subClass.prototype , prot);
			subClass.prototype.constructor = subClass;
			return subClass;
		},	


		ID_SEED : 1 ,
		genId : function (p){
			return (p||"")+"_"+(ns.ID_SEED++);
		},

		delegate : function(fun, _this){
			return function(){
				return fun.apply(_this,arguments);
			};
		},

		getRandom : function(lower, higher) {
			return Math.floor( (higher - lower + 1) * Math.random() ) + lower;
		},


	});


	Date.now=Date.now||function(){ return new Date().getTime(); } ;


	Function.prototype.bind=Function.prototype.bind||function(bindThis,args){
		var Me=this;
		if (arguments.length<2){
			args=false;
		}else{
			args = Array.prototype.slice.call(arguments,1);
		}
		return args?function(){
				return Me.apply(bindThis, args);
			}:function(){
				return Me.apply(bindThis, arguments);
			}
	};


	ns.merger( Array.prototype , {

		forEach : function(fn){
			for ( var i = 0, len = this.length; i < len; i++) {
				fn(this[i],i,this);
			}		
		},

		indexOf: function(item, from){
			var length = this.length;
			from=(from < 0) ? Math.max(0, length + from) : from || 0 ;
			for (var i = from; i < length; i++){
				if (this[i] === item) return i;
			}
			return -1;
		},

		insertAt : function(item,idx) {
			return this.splice(idx, 0, item);
		},

		removeAt : function(idx) {
			return this.splice(idx, 1);
		},
		removeItem : function(item) {
			var idx = this.indexOf(item);
			if (idx >= 0) {
				return this.removeAt(idx);
			}
			return false;
		}
	},false);


	Array.isArray=Array.isArray||function(obj){
		return Object.prototype.toString.apply(obj) === "[object Array]"
	};

	Object.create=Object.create||function(obj){
		var tmp=function(){};
		tmp.prototype=obj;
		return new tmp();
	};

	Object.keys=Object.keys||function(obj){
		var keys=[];
		for (var key in obj){
			keys.push(key);
		}
		return keys;
	};

	Date.now=Date.now||function(){ return new Date().getTime(); } ;


}(exports));




