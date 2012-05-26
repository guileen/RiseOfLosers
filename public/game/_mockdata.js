
var pathsXY=[
	[168,214],
	[476,200],
	[762,130],
	[208,826],
	[1803,147],
	[1287,555],
	[1264,116]
];

var paths=[

	"0,0 102,102 306,298 392,394 388,506 432,590 532,688 588,750 588,820 596,958 640,1008 968,1014 1754,1014 1746,1136",
	"0,0 2,308 210,210 448,214 626,208",
	"0,0 154,148 164,284 162,422 168,504 252,586 248,684 156,750 134,752 76,752 -6,836 -10,896 -54,952 -52,1048 -58,1102 -126,1170 -240,1284",
	"0,0 132,2 288,2 366,-4 388,-24 480,-112 714,-110 806,-110 980,-112 1080,-110 1134,-104 1196,-48 1314,64 1424,70 1704,72 1710,354 1710,404",
	"0,0 -71,2 -351,1 -481,126 -529,181 -616,265 -618,409 -620,488 -622,571 -621,671 -619,743 -670,755 -792,752 -886,753 -1110,756 -1161,752 -1239,831 -1443,833 -1592,678",
	"0,0 86,84 118,123 119,226 120,335 52,413 -4,467 -149,471 -377,471 -450,470 -530,468 -673,465 -724,418 -785,346 -791,273 -797,163 -792,104 -733,52 -668,-6 -597,-10 -360,-7 -199,-4 -104,-3 2,3",
	"0,0 -104,103 -159,157 -165,297 -170,430 -343,433"

]

var IDSEED=1;
var nodeList=[];

paths.forEach(function(item,idx){
	var path=item.split(" ");
	var oPos=pathsXY[idx];

	path.forEach(function(p,i){
		p=p.split(",");
		var node={
			id : IDSEED,
			x : oPos[0]+Number(p[0]),
			y : oPos[1]+Number(p[1]),
			conn : []
		}
		path[i]=node;
		
		node.parent=path;
		node.index=i;

		nodeList.push( node );

		IDSEED++;
	});
	paths[idx]=path;
})

var len=nodeList.length;

for (var i=0;i<len;i++){
	var node1=nodeList[i];
	for (var j=i;j<len;j++){
		var node2=nodeList[j];
		
		if (node1!==node2){
			var dx=node1.x-node2.x, dy=node1.y-node2.y;
			var dis=Math.sqrt( dx*dx+dy*dy);
			if (dis<10){
				var path=node1.parent;
				var index=node1.index;
				path[index]=node2;
				node1.id=node2.id;
				node1.x=node2.x;
				node1.y=node2.y;
				node1.conn==node2.conn;
			}
		}
	}	
}

var nodeMap={}
paths.forEach(function(path,idx){
	var lastNode=path[0];
	nodeMap[lastNode.id]=lastNode;

	for (var i=1;i<path.length;i++){
		var node=path[i];
		nodeMap[node.id]=node;
		lastNode.conn.push(node.id);
		node.conn.push(lastNode.id);
		lastNode=node;
	}
});

var nodeList=[];
for (var id in nodeMap){
	var node=nodeMap[id];
	delete node.parent;
	delete node.index;
	nodeList.push(node);
	console.log(JSON.stringify(node))
}


// var nodeList=[
// 	{
// 		id : 1,
// 		x : 50,
// 		y : 50,
// 		conn : [2 ,4 ,5 ]
// 	},

// 	{
// 		id : 2,
// 		x : 550,
// 		y : 50,
// 		conn : [1 ,3 ,5]
// 	},

// 	{
// 		id : 3,
// 		x : 550,
// 		y : 550,
// 		conn : [2 ,4 ,5]
// 	},

// 	{
// 		id : 4,
// 		x : 50,
// 		y : 550,
// 		conn : [1 ,3 ,5]
// 	},

// 	{
// 		id : 5,
// 		x : 300,
// 		y : 300,
// 		conn : [1,2,3,4]
// 	}
	
// ];

