//Components.utils.import("resource://gre/modules/jsdebugger.jsm");
//var myDebugger = new Debugger(lines);
var functionArray = new Array();
var functionHash = new Object();
var variableArray = new Array();
var variablesHash = new Object();

var test = "def function x(a,b) { \n return FX(2);\n}\n\ndef function FX(x) { \n return 4;\n}"
var lines = test.split("\n");
var numberOfLines = lines.length;

function Function(name, line_number, parent, children, variables, loops, returns) {
	this.name = name; //String of the name of the function 
	this.line_number = line_number; //Int
	this.parent = parent; //Object of parent function, if any
	this.children = children; //Array of functions called
	this.variables = variables; //Hash of variable objects
	this.loops = loops; //Array of loops
	this.returnVals = returns; //Array of Return Value Objects: (value, type)
}

function childFunction(name, parent, line_number){
	this.name = name;
	this.parent = parent;
	this.line_number = line_number;
}

function Variable(name, type, line_number) {
	this.name = name; //String
	this.type = type; //String
	this.line_number = line_number; //Int
}

function Comment(content, line_number) {
	this.content = content; //String
	this.line_number = line_number; //Int
}

function Return(content, type, line_number) {
	this.content = content; //String
	this.type = type; //string
	this.line_number = line_number; //Int
}

//function Loop(name, type, increment, line_number) {
	//this.name = 	
//}

function isVariable(line, line_number, parentFunction) {
	console.log("isVariable called.");
	console.log("line = ", line);
	var name;
	var variable;
	if (line.indexOf("var") !== -1) {
		name = line.slice(4);
		variable = new Variable(name, line_number);
		variableArray.push(variable);
		return true;
	}
	else {
		console.log("returning false");
		return false;}
}

function isComment(line) {
	if (line.indexOf("//") !== -1) {
		commentArray.push(new Comment(line, line_number));
		return true;
	}
	else {return false;}
}

function isFunction(line_number) {
	var function_name;
	if (lines[line_number].indexOf("function") !== -1) {
		function_name = lines[line_number].split(" ");
		console.log("function_name = ", function_name[2].split("(")[0]);
		functionArray.push(function_name[2].split("(")[0]);
		return function_name[2].split("(")[0];
		}
	else {return false;}
}

function isFunction2(line_number) {
	var function_name;
	if (lines[line_number].indexOf("function") !== -1) {
		function_name = lines[line_number].split(" ");
		for (var i = line_number+1; lines[i].indexOf("function ") !== -1; i++) {
		//line = lines[i];
		isChildFunction(line_number, parent_name);
		}
	return i;}
	}

function isChildFunction(line_number, parent_name) {
	var child_function = lines[line_number].split("(")[0];
		if (functionHash[child_function] !== undefined){
		parseChildObject(line_number, parent_name, child_function);
	} //Function has been seen before
}

function parseFunction(name, line_number) {
	console.log("Parsing Function...");
	console.log("name =", name, "line_number = ",  line_number);
	var line;
	var functionObject;
	var returnValsArray = new Array(); //Any return statement in the function
 	var variablesHash = new Object(); //Any variables used in the function 
 	var childrenArray = new Array(); //Any functions called in this function 
 	var loopArray = new Array();
 	var functionName = lines
 	for (var i2 = line_number+1; i2 < numberOfLines-1 || lines[i2].indexOf("function ") === -1 ; i2++) { //Space needed for anon. functions
		console.log("got_here!");
		line = lines[i2];
		console.log("line = ", line);
		if (isVariable(line) === true){
			console.log("Found Variable!");
			var variableObject = parseVariable(line);
			variablesHash[variableObject.name] = variableObject.type;
			}
		else if (isFunction(i2) === true){
			console.log("Found Function!");
			var childrenObject = parseChildFunction(i2, name);
			childrenArray.push(childrenObject);
			}
		else if (isLoop(i2) === true){
			console.log("Found Loop!");
			var loopObject = parseLoop(i2);
			loopArray.push(loopObject);
			}
		else if (isComment(line) === true){
			console.log("Found Comment!");
			parseComment(line);
			}
		else if (isReturn(i2) === true){
			console.log("Found Return!");
			var returnObject = parseReturn(i2);
			returnValsArray.push(returnObject);
		}
		console.log("i2 = ", i2);
		if (i2 === numberOfLines-1){
			break;
		}
	}
	functionObject = new Function(name, line_number, childrenArray, variablesHash, loopArray, returnValsArray);
	console.log("function object = ", functionObject);
	functionArray.push(functionObject);
	functionHash[name] = functionObject;
	console.log("Finished!");
	return i2;
}

function isLoop(line_number) { 
	if (lines[line_number].indexOf("for") !== -1 || lines[line_number].indexOf("while") !== -1){
	}
}

function isReturn(line_number) {
	if (lines[line_number].indexOf("return") !== -1) {return true;}
	return false;
}

function parseReturn(line_number){
	console.log("Parsing Return Statement...");
	var return_content;
	var return_type;
	if (lines[line_number].indexOf("return") !== -1){
		 return_content = lines[line_number].split(" ")[2];
		 console.log("return content = ", return_content);
		 if (variablesHash[return_content] !== undefined) {
		 		return_type = "object";
		 	}
		 else {
		 	return_type = "object"; //typeof(eval(return_content));
		 }
		var returnObject = new Return(return_content, return_type, line_number);
		return returnObject;
	}
	console.log("Finished!");
}

function parseVariable(line_number){
	console.log("Parsing Variable...");
	var variable_name = lines[line_number].split(" ")[1];
	var variable_type = typeof(eval(lines[line_number].split(" ")[3]));
	var returnVariable = new Variable(variable_name, variable_type, line_number);
	//if (parentFunction !== NULL) {
		//parentFunction = functionHash[parentFunction];
		//parentFunction.variables.push(variable);
		//}
	return returnVariable;
	console.log("Finished!");
}

// function parseLoop(line_number){
// 	console.log("Parsing Loop...");
// 	var loop_type = ...;
// 	var loop_scope = ...;
// 	var loop_increment = ...;
// 	console.log("Finished...");
// }

function parseChildObject(line_number, parent_name, child_name){
	console.log("Parsing Child Object");
	child_object = new childFunction(child_name, parent_name, line_number);
	parent_name.childrenArray.push();
}


// function printResults() {
// 	for functionArray.forEach(function(x)) {
// 		console.log(x)
// 		}
// 	for variableArray.forEach(function(x)) {
// 		console.log(x)
// 		}
// 	for commentArray.forEach(function(x)) {
// 		console.log(x)
// 		}
// 	for (var key in functionHash) {
// 		console.log(functionHash[key])
// 		}
// 	}

for (var i3 = 0; i3 < numberOfLines; i3++) {
	console.log(i3, lines[i3]);
	var data = isFunction(i3);
	if (data !== false){
		console.log("Data = ", data);
		i = parseFunction(data, i3);
	}
}

for (var i4 = 0; i4 < numberOfLines; i4++) {
	i = isFunction2(i4);
}

//printResults();