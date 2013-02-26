var colors = ['green', 'red', 'blue', 'yellow']

for (var key in functionHash) {
	var i = 0;
	var object = functionHash[key];
	var functionName = object.name;
	var children = object.children; 
	var line_number = object.line_number;
	drawFunction(functionName, children, line_number, count)
	i++;
}



drawFunction(functionName, children, line_number, count){
	functionName.arc(centerX, center Y, radius, 0, 2*MATH.PI, false);
	functionName.fillStyle = colors[count];
	functionName.fill();
	functionName.lineWidth = 5;
	functionName.strokeStyle = '#003300';
	functionName.stroke();
}

.inset {
	display:block;
	width:100px;
	height:100px;
	border-radius:50px;
	font-size:20px;
	color:#fff;
	line-height:100px;
	text-shadow:0 1px 0 #666;
	text-align:center;
	text-decoration:none;
	box-shadow:1px 1px 2px #000;
	background:#cccbbb;opacity:0.95
}

.inset:hover {
	color:#eee;
	text-shadow:0 0 1px #666;
	text-decoration:none;
	box-shadow:0 0 4px #222 inset;
	opacity:1}