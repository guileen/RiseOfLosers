
;(function(exports,undefined){
	var ns=exports.ROL;

var Scene=ns.Scene=ns.newClass({

	id : null ,
	index : null ,
	game : null ,
	container : null ,

	beforeInit : ns.noop,	
	init : function(game){
		this.beforeInit(game);
		this.game=game;
		this.onInit(game);
	},
	onInit : ns.noop,

	beforeRun : ns.noop,

	update : ns.noop,

	render : ns.noop,

	handleInput : ns.noop,
	
	destroy : ns.noop

});
	
}(exports));