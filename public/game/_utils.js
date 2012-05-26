


function genRandom(lower, higher) {
	lower = (lower||lower===0)?lower : 0;
	higher = (higher||higher===0)?higher : 9999;
	return Math.floor( (higher - lower + 1) * Math.random() ) + lower;
}


function $id(id){
	return document.getElementById(id);
}



function getDomOffset(dom){
			if (dom.getBoundingClientRect){
				//{left:left, top:top}
				return dom.getBoundingClientRect();
			}
			var left = dom.offsetLeft, top = dom.offsetTop;
			while((dom = dom.parentNode) && dom != document.body && dom != document){
				left += dom.offsetLeft;
				top += dom.offsetTop;
			}
			return {left:left, top:top};
		};

function drawPoint(context,px,py,color){
	var bak=context.fillStyle;
	context.fillStyle=color||bak;
	context.fillRect(px-2,(py-2)*Config.Y_SCALE,4,4*Config.Y_SCALE);
	//context.fillStyle=bak;
}

function drawLine(context,p1,p2, color){
	var bak=context.strokeStyle;
	context.strokeStyle=color||bak;
	context.beginPath();
	context.moveTo( p1[0] ,p1[1]*Config.Y_SCALE );
	context.lineTo( p2[0] ,p2[1]*Config.Y_SCALE );
	context.stroke();
	context.closePath();
	// context.strokeStyle=bak;	
}
function drawPoly(context,poly, color ,fill){
	var bak=context.strokeStyle;
	context.strokeStyle=color||bak;	
	context.beginPath();
	context.moveTo( poly[0][0] ,poly[0][1]*Config.Y_SCALE );
	for (var i=0,len=poly.length;i<len;i++){
		var idx=(i+1)%len;	      		
		context.lineTo( poly[idx][0] ,poly[idx][1]*Config.Y_SCALE );
	}
	if (fill){
		context.fillStyle=color||bak;	
		context.fill();
	}else{
		context.stroke();
	}	
	context.closePath();

	// context.strokeStyle=bak;	
}

function drawPath(context,path, color,width){
	if (!path || !path.length){
		return;
	}
	width=width||1;
	context.lineWidth=width;
	var bak=context.strokeStyle;
	context.strokeStyle=color||bak;	
	context.beginPath();

	context.moveTo( path[0][0] ,path[0][1]*Config.Y_SCALE );
	for (var i=0,len=path.length;i<len;i++){
			      		
		context.lineTo( path[i][0] ,path[i][1]*Config.Y_SCALE );
	}
	context.stroke();
	context.closePath();
	context.lineWidth=1;

	// context.strokeStyle=bak;	
}

function drawFoundPath(context,pathNode, color ,fill){
	if (!pathNode || !pathNode.length){
		return;
	}
	context.lineStyle="dotted"
	var bak=context.strokeStyle;
	context.strokeStyle=color||bak;	
	context.beginPath();

	context.moveTo( pathNode[0].p[0] ,pathNode[0].p[1]*Config.Y_SCALE );
	for (var i=0,len=pathNode.length;i<len;i++){
			      		
		context.lineTo( pathNode[i].p[0] ,pathNode[i].p[1]*Config.Y_SCALE );
	}
	if (fill){
		context.fillStyle=color||bak;		
		context.fill();
	}else{
		context.stroke();
	}	
	context.closePath();

	// context.strokeStyle=bak;	
}

function drawCircle(context,x,y,r ,color,fill){
	// console.log(context,x,y,r ,color,fill)
	var bak=context.strokeStyle;
	context.strokeStyle=color||bak;
 	context.beginPath();
    context.arc(x, y*Config.Y_SCALE, r, 0, 2 * Math.PI, false);
	if (fill){
		context.fillStyle=color||bak;	
		context.fill();
	}else{
		context.stroke();
	}
    context.closePath();
    // context.strokeStyle=bak;
}


//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////
//////////////////////////////////////

function createPolyByRect(w,h,r,x,y){
	var poly=[
		[0,0],
		[w,0],
		[w,h],
		[0,h]
	];
	GeomUtils.rotatePoly(poly,r);
	var aabb=GeomUtils.calPolyAABB(poly);
	x=x-aabb[0];
	y=y-aabb[1];
	GeomUtils.translatePoly(poly,x,y);
	return poly;
}

function getRandomPoly(x,y,minR,maxR,minSide,maxSide){
	minR=minR||10;
	maxR=maxR||30;
	minSide=minSide||3, maxSide=maxSide||9;
	var scaleX= genRandom(10,20)/10;
	var scaleY= genRandom(10,20)/10;

	var radius= genRandom(minR,maxR);
	var n= genRandom(minSide,maxSide);

	var poly=createPoly(x,y,radius, n,scaleX,scaleY)

	return poly;	
}


function createPoly(x,y,R, n,scaleX,scaleY){
	if (!R){
		return [ [x,y] ];
	}
	n=n||4;
		
	scaleX=scaleX||1 , scaleY=scaleY||1;
	var poly=[];
	var perAng=Math.PI*2/n;
	for (var i=0;i<n;i++ ){
		var ang=perAng*i;
		var _x= x+R*Math.cos(ang)*scaleX;
		var _y= y+R*Math.sin(ang)*scaleY;
		poly.push( [_x,_y]);
	}
	//poly.normals=GeomUtils.calPolyunitNormalLine(poly);
	
	return poly;
}

function createPolyFromArray(arr,ox,oy){
	var poly=[];
	ox=ox||0;
	oy=oy||0;
	for (var i=0,len=arr.length;i<len;i=i+2 ){
		poly.push( [  ox+(arr[i]||0), oy+(arr[i+1]||0) ] );
	}
	return poly;
}





function getLineCrossPolys( _p1,_p2,polyList){
	var rs=[];
	var line=[ _p1,_p2  ];
	polyList=polyList||Game.polyManager.polyList;
	line.aabb=GeomUtils.calLineAABB(_p1,_p2);
	var intersect=false;
	for (var j=0,count=polyList.length;j<count;j++){
		var poly=polyList[j];
		intersect=Game.polyManager.checkPolyCollide(poly, line,true );
		if (intersect){
			rs.push( poly.id );
		}
	}
	return rs;
}

