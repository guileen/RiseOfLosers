;
(function(){
    this.dui = {};
    //常用类型检测
    this.dui.isDef = function(obj){
        return (typeof(obj) != 'undefined');
    };
    this.dui.isStr = function(obj){
        return (typeof(obj) == 'string');
    };
    this.dui.isNum = function(obj){
        return (typeof(obj) == 'number');
    };
    this.dui.isFunc = function(obj){
        return (typeof(obj) == 'function');
    };
    this.dui.isArr = function(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
    this.dui.isObj = function(obj){
        return (typeof(obj) == 'object') && !isArr(obj);
    };
    //原子对象
    this.dui.atom = function(obj){
        return obj || {};
    };
    //高级浏览器快捷功能
    this.dui.cout = function(content){
        console.info(content);
    };
    this.dui.clog = function(content){
        console.log(content);
    };
    //元素对象
    this.dui.WrappedElement = function(original){
        this.domEl = original;
    };
    dui.WrappedElement.prototype.find = function(selector){
        return dui.$WE(this.domEl.querySelector(selector));
    };
    dui.WrappedElement.prototype.finds = function(selector){
        return dui.$WE(this.domEl.querySelectorAll(selector));
    };
    dui.WrappedElement.prototype.parent = function(id){
        //DO NOTHING...
    };
    dui.WrappedElement.prototype.event = function(type, callback, useCapture){
        if (this.domEl.addEventListener) this.domEl.addEventListener(type, callback, useCapture);
        else for (var i = this.domEl.length; i; i--) {
            this.domEl[i - 1].addEventListener(type, callback, useCapture);
        }
        return this;
    };
    dui.WrappedElement.prototype.css = function(name, value){
        if (arguments.length == 1 && typeof(arguments[0]) == 'string') return this.domEl.style.getPropertyValue(name);
        if (this.domEl.style) {
            if (arguments.length == 1) for (var key in arguments[0]) {
                this.domEl.style.setProperty(key, arguments[0][key]);
            }
            else this.domEl.style.setProperty(name, value);
        }
        else for (var i = this.domEl.length; i; i--) {
            dui.$WE(this.domEl[i - 1]).css(name, value);
        }
        return this;
    };
    dui.WrappedElement.prototype.attr = function(name, value){
        if (this.domEl.getAttribute) {
            if (arguments.length == 2) {
                this.domEl.setAttribute(name, value);
                return this;
            }
            return this.domEl.getAttribute(name);
        }
        return;
    };
    dui.WrappedElement.prototype.text = function(text){
        if (this.domEl.innerText) {
            if (arguments.length == 1) {
                this.domEl.innerText = text;
                return this;
            }
            return this.domEl.innerText;
        }
        return;
    };
    dui.WrappedElement.prototype.offsetWidth = function(){
        return this.domEl.offsetWidth || 0;
    };
    dui.WrappedElement.prototype.offsetHeight = function(){
        return this.domEl.offsetHeight || 0;
    };
    this.dui.$i = function(id){
        return dui.$WE(document.getElementById(id));
    };
    this.dui.$ = function(selector, context){
        var context = context || document;
        return dui.$WE(context.querySelectorAll(selector));
    };
    this.dui.$$ = function(selector, context){
        var context = context || document;
        return dui.$WE(context.querySelector(selector));
    };
    this.dui.$c = function(cls, context){
        var context = context || document;
        return dui.$WE(context.getElementsByClassName(cls));
    };
    this.dui.$t = function(tag, context){
        var context = context || document;
        return dui.$WE(context.getElementsByTagName(tag));
    };
    this.dui.$WE = function(domEl){
        return new dui.WrappedElement(domEl);
    };
})();
(function(){
    //界面元素
    this.dui.$window = dui.$WE(window);
    this.dui.$container = dui.$i('Container');
    this.dui.$canvasLayer = dui.$i('CanvasLayer');
    this.dui.$uiLayer = dui.$i('UILayer');
    this.dui.$alertShadow = dui.$i('AlertShadow');
    this.dui.$eventAlertYN = dui.$i('EventAlertYN');
    this.dui.$eventAlertOK = dui.$i('EventAlertOK');
    this.dui.$dialogShadow = dui.$i('DialogShadow');
    this.dui.$marketDialog = dui.$i('MarketDialog');
    this.dui.$hospitalDialog = dui.$i('HospitalDialog');
    this.dui.$bankDialog = dui.$i('BankDialog');
    this.dui.$netbarDialog = dui.$i('NetbarDialog');
    this.dui.$redCrossDialog = dui.$i('RedCrossDialog');
    //环境变量
    this.dui.win_stat = {
        width: 0,
        height: 0
    };
    this.dui.conf = {
        container_width: 750,
        container_height: 500,
        dialog_shadow: true,
        alert_shadow: true
    };
    //
    this.dui.updateWindowStat = function(){
        dui.win_stat.width = window.innerWidth;
        dui.win_stat.height = window.innerHeight;
    };
    this.dui.autoResizeContainer = function(){
        dui.$container.css({
            'width': dui.conf.container_width + 'px',
            'height': dui.conf.container_height + 'px',
            'left': ((dui.win_stat.width - dui.conf.container_width) > 0 ? (dui.win_stat.width - dui.conf.container_width) / 2 : 0) + 'px',
            'top': ((dui.win_stat.height - dui.conf.container_height) > 0 ? (dui.win_stat.height - dui.conf.container_height) / 2 : 0) + 'px'
        });
    };
    //
    this.dui.eventAlert = function(eid, text, type, shadow, icon){
        var ea = type ? dui.$eventAlertYN : dui.$eventAlertOK;
        var content = ea.find('td').text(text);
        arguments.length == 5 && content.css('background-image', 'url(' + icon + ')');
        (dui.conf.alert_shadow || shadow) && dui.$alertShadow.css('display', 'block');
        ea.attr('eid', eid).css({
            'display': 'block',
            'opacity': '0'
        }).css({
            'opacity': '1',
            'left': ((dui.conf.container_width - ea.offsetWidth()) > 0 ? (dui.conf.container_width - ea.offsetWidth()) / 2 : 0) + 'px',
            'top': ((dui.conf.container_height - ea.offsetHeight()) > 0 ? (dui.conf.container_height - ea.offsetHeight()) / 2 : 0) + 'px'
        });
    };
    //
    this.dui.showDialog = function(dialog){
        dui.conf.dialog_shadow && dui.$dialogShadow.css('display', 'block');
        dialog.css({
            'display': 'block',
            'opacity': '0'
        }).css('opacity', '1');
    };
    this.dui.hideDialog = function(dialog){
        dui.conf.dialog_shadow && dui.$dialogShadow.css('display', 'none');
        dialog.css({
            'display': 'none',
            'opacity': '0'
        }).css('opacity', '1');
    };
    this.dui.marketDialog = function(){
        dui.showDialog(dui.$marketDialog);
    };
    this.dui.hospitalDialog = function(){
        dui.showDialog(dui.$hospitalDialog);
    };
    this.dui.bankDialog = function(){
        dui.showDialog(dui.$bankDialog);
    };
    this.dui.netbarDialog = function(){
        dui.showDialog(dui.$netbarDialog);
    };
    this.dui.redCrossDialog = function(){
        dui.showDialog(dui.$redCrossDialog);
    };

    this.dui.$placeDialog = dui.$i('PlaceDialog');
    this.dui.placeDialog = function(){
        dui.showDialog(dui.$placeDialog);
    };
    this.dui.placeDialog.close = function(){
        dui.hideDialog(dui.$placeDialog);
    };
})();
