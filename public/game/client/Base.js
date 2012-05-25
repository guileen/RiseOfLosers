
;(function(exports, undefined){
	var ns=exports.ROL;
	
	ns.pixelRatio=window.devicePixelRatio || 1 ; //ns.getDevicePixelRatio();

	var ua= window.navigator.userAgent.toLowerCase();
	ns.browser={};
	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			/(safari)[ \/]([\w.]+)/.exec( ua ) ||
			/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) || [];		
	ns.browser[ match[1] ]=true;
	ns.browser.air=!!window.air;
	ns.browser.mobile=ua.indexOf("mobile")>0; 

	ns.browser.viewport={
		width:window.innerWidth,
		height:window.innerHeight
	};
    ns.browser.screen={
		width:window.screen.availWidth*ns.pixelRatio, 
		height:window.screen.availHeight*ns.pixelRatio
	};


	ns.os={};
	var os=ua;
	if (ns.browser.air) {
		os = air.Capabilities ? air.Capabilities.os : "";
	}
	os= /(mac)/.exec( os ) || /(windows)/.exec( os ) || /(android)/.exec( os ) || /(linux)/.exec( os ) || [] ; 
	ns.os[ os[1] ]=true;

	ns.os.iPhone=/iphone/.test(ua);
	ns.os.iPad=/ipad/.test(ua);
	ns.os.iPhone4=ns.os.iPhone && ns.pixelRatio==2;	
	ns.os.iPad3=ns.os.iPad && ns.pixelRatio==2;	

	ns.os.iOS=	ns.os.iPhone || ns.os.iPad ;
	ns.os.iOS4= ns.os.iOS && ua.indexOf("os 4")>0;
	ns.os.iOS5= ns.os.iOS && ua.indexOf("os 5")>0;



	var fragment = document.createDocumentFragment();
	var div = document.createElement("div");
	fragment.appendChild(div);
	ns.getFragmentDom= function(){
		return div;
	};

	ns.css={};
	ns.detectCssAttribute=function(attrList,style){
			style=style||ns.getFragmentDom().style;
			var normalName=attrList[0];
			for(var i=0;i<attrList.length;i++){
				if (attrList[i] in style){
					ns.css[normalName]=attrList[i];
					break ;
				}
			}	
		};
	var css4Detect=[
		["backgroundSize", "webkitBackgroundSize", "MozBackgroundSize","msBackgroundSize","OBackgroundSize",,"msBackgroundSize"],
		["transform", "webkitTransform", "MozTransform", "msTransform", "OTransform", "msTransform"],
		["transformOrigin", "webkitTransformOrigin", "MozTransformOrigin", "msTransformOrigin", "OTransformOrigin", "msTransformOrigin"],
		["perspective", "webkitPerspective", "MozPerspective", "msPerspective", "OPerspective","msPerspective"]
	];
	var style=ns.getFragmentDom().style;
	css4Detect.forEach(function(item,idx){
			ns.detectCssAttribute(item, style);
		});
	ns.supportTransform=!!ns.css.transform ;
	ns.supportTransform3D=!!ns.css.perspective ;



	ns.merger(ns , {
		isDocReady : function(doc){
			return document.readyState === "complete";	
		},

		isMobile : function(){
			return "ontouchstart" in document
		},

		$id : function(id){
			return document.getElementById(id);
		},

		hideAddressBar : function(){ // iPhone
			setTimeout(function(){ 
				window.scrollTo(0, 1);
				hideAddressBar();
			}, 1);			
		},
		
		setViewportScale : function(scale,scalable){
			scale=scale||1;

			var meta=document.createElement("meta");
			meta.setAttribute("name","viewport");
			var content=[
				"user-scalable=", scalable?"yes":"no",
				"width=device-width", 
				"height=device-height",
				"minimum-scale="+scale, 
				"maximum-scale="+scale,
				"initial-scale="+scale
			];
			meta.setAttribute("content", content.join(", "));
			document.head.appendChild(meta);
		},

		createDom : function (tag , property){
			var dom=ns.getDoc().createElement(tag);
			if (property!=null){
				ns.setDomProperty(dom, property);
			}
			return dom;	
		},

		setDomProperty : function(dom,property){
			var p=property.parent;
			delete property.parent;
			var domStyle=dom.style;
			for ( var key in property) {
				if (key=="style"){
					ns.merger(domStyle, property[key]);
				}else{
					dom[key] = property[key];
				}
			}
			if (p) {
				p=ns.$id(p);
				if (p!=null){
					p.appendChild(dom);
				}
			};

		},

		setDomStyle : function(dom,style){
			ns.setDomProperty(dom, { style : style });
		},
		
		setDomPos : (function(){
				if (ns.supportTransform3D){
					return function(dom,x,y){
							dom.style[ns.css.transform]="translate3d("+ x+"px,"+y+"px,0px)";
						};
				}
				if (ns.supportTransform){
					return function(dom,x,y){
							dom.style[ns.css.transform]="translate("+ x+"px,"+y+"px)";
						};
				}
				return function(dom,x,y){
						dom.style.left=x+"px";
						dom.style.top=y+"px";
					};
				
			})(),

		removeDom : function(dom) {
			if (dom.parentNode!=null){
				dom.parentNode.removeChild(dom);
			}else {
				var fragmentChild=ns.getFragmentDom();
				fragmentChild.appendChild(dom);
				fragmentChild.innerHTML="";
			}
		},

		isDom : function(v){
			HTMLElement=HTMLElement||null;
			if (HTMLElement!=null){
				return v instanceof HTMLElement	;
			}
			return v && v.tagName;
		}

	});


}(exports));





