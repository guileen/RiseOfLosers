
;(function(exports, undefined){
	var ns=exports.ROL;
	
	ns.merger(ns,{

		addEvent : function(dom, type, fn, useCapture){
			dom.addEventListener(type, fn, !!useCapture);
		},
			
		stopEvent : function (event) {
			event.stopPropagation();
			event.preventDefault();
			if (event.stopImmediatePropagation){
				event.stopImmediatePropagation();
			}
			event.stopped=true;
		},	

		removeEvent : function(dom, type, fn, useCapture) {
			if (!fn || !dom || !type) {
				return false;
			}
			dom.removeEventListener(type, fn, !!useCapture);
		},

		KeyState : {},

		Key : {
			A : 65,	
			D : 68,	
			S : 83,	
			W : 87,
			P : 80,
			J : 74,
			LEFT : 37,
			UP : 38,
			RIGHT : 39,
			DOWN : 40,
			SPACE : 32 ,
			MOUSE_LEFT : 1,
			MOUSE_MID : 2,
			MOUSE_RIGHT : 3,			
			MOUSEDOWN : "MOUSEDOWN",
			TOUCH : "TOUCH"
		},

		initEvent : function (){

			var ns=this;
			
			ns.addEvent(document,"keydown",function(evt){
					ns.KeyState[evt.keyCode]=true;
				},true);
			ns.addEvent(document,"keyup",function(evt){
					ns.KeyState[evt.keyCode]=false;
				},true);

			ns.addEvent(document,"mousedown",function(evt){
					ns.KeyState[ns.Key.MOUSEDOWN]=true;
				},true);
			ns.addEvent(document,"mouseup",function(evt){
					ns.KeyState[ns.Key.MOUSEDOWN]=false;
				},true);			
	
			ns.addEvent(document,"touchstart",function(evt){
					ns.KeyState[ns.Key.TOUCH]=true;
				},true);
			ns.addEvent(document,"touchend",function(evt){
					ns.KeyState[ns.Key.TOUCH]=false;
				},true);

		}

	});

	ns.windowBlurListener=[];
	window.addEventListener("blur",function(event){
		for (var i=0,len=ns.windowBlurListener.length;i<len;i++){
			ns.windowBlurListener[i](event);
		}
	});
	ns.windowFocusListener=[];
	window.addEventListener("focus",function(event){
		for (var i=0,len=ns.windowFocusListener.length;i<len;i++){
			ns.windowFocusListener[i](event);
		}
	});

})(exports);
