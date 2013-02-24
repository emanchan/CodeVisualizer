Components.utils.import("resource://gre/modules/jsdebugger.jsm");
var myDebugger = new Debugger(lines);
var functionArray = new Array();
var functionHash = new Object();
var variableArray = new Array();
var code = ...;
var lines = code.split("\n");
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

function isVariable(line, line_number, parentFunction) {
	var name = ...;
	var variable;
	if (line.indexOf("var") !== -1) {
		name = line.slice(4);
		variable = new Variable(name, line_number)
		variableArray.push(variable);
		if (parentFunction !== NULL) {
			parentFunction = functionHash[parentFunction];
			parentFunction.variables.push(variable);
			}
		return true;
	}
	else {return false;}
}

function isComment(line) {
	if (line.indexOf("//") !== -1) {
		commentArray.push(new Comment(line, line_number));
		return true;
	}
	else {return false;}
};

function isFunction(line_number) {
	var function_name;
	if (line.indexOf("function") !== -1) {
		function_name = lines[line_number].split(" ");
		parseFunction(function_name[1].split("("), line_number);
		return true;
		}
	else {return false;}
};

function parseFunction(name, line_number) {
	console.log("Parsing Function...")
	var line = ...;
	var functionObject;
	var returnValsArray = new Array(); //Any return statement in the function
 	var variablesHash = new Object(); //Any variables used in the function 
 	var childrenArray = new Array(); //Any functions called in this function 
 	var functionName = lines
 	for (i = line+1; lines[i].indexOf("function ") !== -1; i++) { //Space needed for anon. functions
		line = lines[i];
		if (isVariable(line) === true){
			parseVariable();
			}
		if (isFunction(line) === true){
			parseChildFunction();
			}
		if (isLoop(line) === true){
			parseLoop();
			}
		if (isComment(line) === true){
			parseComment(line);
			}
		if (isReturn(line) === true){
			parseReturn(line, returnValsArray);
		}
	}
	functionObject = Function(name, line_number, children, variables, returns);
	functionArray.push(functionObject);
	functionHash[name] = functionObject;
}

function isLoop(line_number) { 
	if (lines[line_number].indexOf("for") !== -1 || lines[line_number].indexOf("while") !== -1){
	}
};

function isReturn(line_number) {
	if (lines[line_number].indexOf("return") !== -1) {return true;}
	return false;
}

function parseReturn(line_number, returnValsArray){
	var return_content;
	var return_type;
	if (lines[line_number].indexOf("return") !== -1){
		 return_content = lines[line_number].split(" ")[1];
		 if (variablesHash[return_content] !== undefined) {
		 		return_type = "object";
		 	}
		 else {return_type = typeof(eval(return_content));}
		var returnObject = new Return(return_content, return_type, line_number);
		returnValsArray.push(returnObject);
	}

}


for (i = 0; i < numberOfLines; i++) {
	var line = lines[i]
	//Check if Comment?

	//Check if Function

	//Check if Loop
};

function printResults() {
	for functionArray.forEach(function(x)) {
		console.log(x)
		}
	for variableArray.forEach(function(x)) {
		console.log(x)
		}
	for commentArray.forEach(function(x)) {
		console.log(x)
		}
	for (var key in functionHash) {
		console.log(functionHash[key])
		}
	}
}

var test = "def function x(a,b) { \n return a+b;\n}""