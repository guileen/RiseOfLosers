;
(function(){
    this.ROL = true;
    //常用类型检测
    this.isDef = function(obj){
        return (typeof(obj) != 'undefined');
    };
    this.isStr = function(obj){
        return (typeof(obj) == 'string');
    };
    this.isNum = function(obj){
        return (typeof(obj) == 'number');
    };
    this.isFunc = function(obj){
        return (typeof(obj) == 'function');
    };
    this.isArr = function(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    this.isObj = function(obj){
        return (typeof(obj) == 'object') && !isArr(obj);
    };
    //原子对象
    this.atom = function(obj){
        return obj || {};
    };
    //高级浏览器快捷功能
    this.cout = function(content){
        console.info(content);
    };
    this.clog = function(content){
        console.log(content);
    };
    this.$i = function(id){
        return document.getElementById(id);
    };
    this.$ = function(selector, context){
        var context = context || document;
        return context.querySelectorAll(selector);
    };
    this.$$ = function(selector, context){
        var context = context || document;
        return context.querySelector(selector);
    };
    this.$c = function(cls, context){
        var context = context || document;
        return context.getElementsByClassName(cls);
    };
    this.$t = function(tag, context){
        var context = context || document;
        return context.getElementsByTagName(tag);
    };
    this.$event = function(element, type, callback, useCapture){
        element.addEventListener(type, callback, useCapture);
    };
    /*
     this.$css = function(element, name, value){
     if (isArr(element)) {
     for (var i = 0; i < element.length; i++) {
     if (arguments.length == 2) {
     if (typeof(arguments[1]) == 'string') { return element.style.getPropertyValue(name); }
     for (var key in arguments[1]) {
     element.style.setProperty(key, arguments[1][key]);
     }
     continue;
     }
     else element.style.setProperty(name, value);
     }
     }
     else {
     if (arguments.length == 2) {
     if (typeof(arguments[1]) == 'string') { return element.style.getPropertyValue(name); }
     for (var key in arguments[1]) {
     element.style.setProperty(key, arguments[1][key]);
     }
     return;
     }
     else element.style.setProperty(name, value);
     }
     };
     */
})();
/*
 (function(){
 //界面元素
 this.$container = $i('Container');
 this.$canvasLayer = $i('CanvasLayer');
 this.$uiLayer = $i('UILayer')
 //环境变量
 this.win_stat = {
 width: 0,
 height: 0
 };
 this.conf = {
 container_width: 750,
 container_height: 500
 };
 //
 this.getWindowStat = function(){
 win_stat.width = window.innerWidth;
 win_stat.height = window.innerHeight;
 };
 this.autoResizeContainer = function(){
 $css($container, {
 'width': conf.container_width,
 'height': conf.container_height,
 'left': (win_stat.width - conf.container_width) > 0 ? (win_stat.width - conf.container_width) / 2 : 0,
 'top': (win_stat.height - conf.container_height) > 0 ? (win_stat.height - conf.container_height) / 2 : 0
 });
 cout($container.style.getPropertyValue('width'));
 };
 //
 this.eventAlert = function(text, type, icon){
 var tpl = type ? $($('#EventAlertYN').val()) : $($('#EventAlertOK').val());
 var content = tpl.find('.content td');
 content.text(text);
 arguments.length > 2 && content.css('background-image', 'url(' + icon + ')');
 tpl.appendTo($uiLayer).fadeIn();
 $css(tpl, {
 'left': (conf.container_width - tpl.outerWidth()) > 0 ? (conf.container_width - tpl.outerWidth()) / 2 : 0,
 'top': (conf.container_height - tpl.outerHeight()) > 0 ? (conf.container_height - tpl.outerHeight()) / 2 : 0
 });
 tpl.find('.ea-yes').click(function(){
 $(this).closest('.event-alert').fadeOut(function(){
 $(this).remove();
 });
 //在这里添加
 });
 tpl.find('.ea-no').click(function(){
 $(this).closest('.event-alert').fadeOut(function(){
 $(this).remove();
 });
 });
 tpl.find('.ea-ok').click(function(){
 $(this).closest('.event-alert').fadeOut(function(){
 $(this).remove();
 });
 });
 };
 })();
 */
/*
 $event(window, 'resize', function(){
 getWindowStat();
 autoResizeContainer();
 });
 getWindowStat();
 autoResizeContainer();
 //eventAlert("神马？那个患者太没素质了，一喷嚏打我脸上，我中了病毒性感冒！健康值降低X点");
 */
