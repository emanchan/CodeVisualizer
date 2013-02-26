var colors = ['green', 'red', 'blue', 'yellow']
var FunctionElementHash = new Object();

function FunctionElement(object, X, Y){
	this.data = object; //Function Data
	this.X = X;
	this.Y = Y;
}

for (var key in functionHash) {
	var i = 0;
	var object = functionHash[key];
	var functionName = object.name;
	var children = object.children; 
	var line_number = object.line_number;
	drawFunction(functionName, children, line_number, count)
	i++;
}

for (var key in FunctionElementHash) {
	var object = FunctionElementHash[key];
	if (object.data.children.length !== 0) { //Function has Children
		for object.data.children.forEach(function(x)) {
			drawLine(object, FunctionElementHash[object.data.x])
		}
	}
}


drawFunction(object, functionName, children, line_number, count){
	var FunctionElement = new FunctionElement(object, X, Y)
	functionName.arc(centerX, center Y, radius, 0, 2*MATH.PI, false);
	functionName.fillStyle = colors[count];
	functionName.fill();
	functionName.lineWidth = 5;
	functionName.strokeStyle = '#003300';
	functionName.stroke();

}

drawLine(parentFunctionElement, childFunctionElement) {
	ctx.lineWidth = 5;
	ctx.beginPath();
	ctx.moveTo(parentFunctionElement.X, parentFunctionElement.Y);
	ctx.lineTo(childFunctionElement.X, childFunctionElement.Y);
}
