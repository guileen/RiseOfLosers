

;(function(exports,undefined){
	var ns=exports.ROL;

	var Place=ns.Place=function(cfg){	

		for (var property in cfg ){
			this[property]=cfg[property];
		}

	};

	Place.prototype={
		constructor : Place ,

		id : null ,
		name : null ,
		img : null,

		baseX : 0,
		baseY : 0,

		node : null,
		data : null,

		init : function(){
			// console.log(this.node.pos)
			this.img=ns.ResPool.getRes(this.img);
			if (!this.img){
				this.img=ns.ResPool.getRes("defalut-place");
				this.baseX=24;
				this.baseY=24;
			}

		},
		sync : function(){

		},

		render : function(deltaTime , context){
			var pos = this.node.pos;

			context.drawImage(this.img, pos[0]-this.baseX, pos[1]-this.baseY);

		}


	};




}(exports));
