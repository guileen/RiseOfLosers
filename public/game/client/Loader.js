

;(function(exports,undefined){
	var ns=exports.ROL;

	ns.ResPool={	
		cache : {},
		_count : 0,
		getRes : function(id,clone){
			var res=this.cache[id]||null;
			if (clone && res!=null){
				res=res.cloneNode(true);
			}
			return res;
		},
		addRes : function(id ,res){
			this.cache[id]=res;
			this._count++;
		},
		removeRes : function(id){
			var res=this.cache[id];
			delete this.cache[id];
			if (ns.isDom(res)){
				ns.removeDom(res);
			}
			this._count--;
		},
		clear : function(){
			for (var id in this.cache){
				this.removeRes(id);
			}
			this.cache={};
			this._count=0;
		},
		size : function(){
			return this._count;
		}
	};


ns.ResLoader=ns.newClass({

	autoLoadAudio : true ,
	autoLoadImage : true ,

	constructor : function(cfg){
		ns.merger(this,cfg);
		// this.cache = this.cache||ns.ResPool.cache;
	},
 
	loadAudio : function(src,callback,onError){
		var audio=document.createElement('audio');
		if ( callback ){
			audio.addEventListener("canplaythrough",function(evt){
				callback.call(this,evt);
				this.removeEventListener("canplaythrough",arguments.callee);	
			});
		}
		if ( onError ){
			audio.addEventListener("error",function(evt){
				onError.call(this,evt);
				this.removeEventListener("error",arguments.callee);	
			});
		}
		audio.src = src;		
		audio.autobuffer=true;
		audio.preload=true;
		audio.load();
		return audio;
	},

	loadImage : function(src,callback,onError){
		var img=document.createElement('img');	
		if ( callback ){
			img.addEventListener("load",function(evt){
				callback.call(this,evt);
				this.removeEventListener("load",arguments.callee);	
			});
		}
		if ( onError ){
			img.addEventListener("error",function(evt){
				onError.call(this,evt);
				this.removeEventListener("error",arguments.callee);	
			});
		}
		img.src = src;	
		return img;
	},

	load : function(resList,onloaded,onloading){
		var Me=this;
		var resCache={};
		var totalCount=resList.length;
		var loadedCount=0;
		var loadedList=[];
		var loadErrList=[];

		function _onLoaded(evt){
			var _res=evt.target;
			_res.loaded=true;
			loadedList.push( _res );
		}
		function _onError(evt){
			var _res=evt.target;
			_res.err=true;
			loadedList.push( _res );
			loadErrList.push( _res.src );	
		}

		for (var i=0;i<totalCount;i++){
			var res=resList[i];
			res.src=res.src||res.url;
			res.id=res.id||res.src ;
			res.type=res.type||"img";

			if (res.type==="audio"){
				if (this.autoLoadAudio){
					resCache[res.id]= this.loadAudio( res.src , 
						_onLoaded, _onError	);	
				}else{
					loadedList.push( res );
				}
			}else{ 
			// }else if (res.type==="img"){
				resCache[res.id]= this.loadImage( res.src , 
					_onLoaded, _onError	);
						
			}
		}
		
		function check(){
			if (loadedCount+loadErrList.length>=totalCount){
				if (onloaded){
					setTimeout(function(){
						onloaded(totalCount, resCache, loadErrList );
					},10);	
				}
			}else{
				var _delay=0;
				var res=loadedList[loadedCount];
				if (res!=null){
					loadedList[loadedCount]=null;				
					loadedCount++;
					if (onloading){
						_delay=onloading(loadedCount, totalCount, res );
					}
				}
				setTimeout(check,_delay||10);
			}	
		}
		check();

		return resCache;
	}
});



}(exports));
