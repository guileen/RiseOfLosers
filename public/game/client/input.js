
function createController(game){


	//创建一个tap listener的实例
	var toucher=game.toucher=new Toucher.Scroll({

		touchCount : 1 ,

		target : game.canvas ,

		isTrigger : function(touchWrapper,wrapperList,touchCoontroller){
			return touchWrapper.touching && touchWrapper.target==this.target ;
		},

		onScroll : function(touchWrappers,event,touchController){
			// tap事件要执行的动作
			var touchWrapper=touchWrappers[0];
			var dx=touchWrapper.pageX-touchWrapper.lastPageX;
			var dy=touchWrapper.pageY-touchWrapper.lastPageY;

			game.currentScene.scrollBy(-dx,-dy);

		}	
	});

	var controller=game.controller=new Toucher.Controller({
		dom :  document.body ,
		preventDefaultMove :true
	});


	controller.init();

	//把自定义事件注册到controller里
	controller.addListener(toucher);

}



