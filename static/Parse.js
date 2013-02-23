Components.utils.import("resource://gre/modules/jsdebugger.jsm");
var myDebugger = new Debugger(lines);
var functionArray = new Array();
var functionHash = new Object();
var variableArray = new Array();
var code = ...;
var lines = code.split("\n");
var numberOfLines = lines.length;

function Function(name, line_number, parent, children, variables) {
	this.name = name;
	this.line_number = line_number;
	this.parent = parent;
	this.children = children; 
	this.variables = variables //Array
}

function Variable(name, type, line_number) {
	this.name = name;
	this.type = type; 
	this.line_number = line_number;
}

function Comment(content, line_number) {
	this.content = content;
	this.line_number = line_number; 
}

function isVariable(line, line_number, parentFunction) {
	var name = ...;
	var variable;
	if (line.indexOf("var") != -1) {
		name = line.slice(4);
		variable = new Variable(name, line_number)
		variableArray.push(variable);
		if (parentFunction != NULL) {
			parentFunction = functionHash[parentFunction];
			parentFunction.variables.push(variable);
			}
		return true;
	}
}

function isComment(line) {
	if (line.indexOf("//") != -1) {
		commentArray.push(new Comment(line, line_number));
		return true;
	}
};

function isFunction(line, line_number) {
	var function_name;
	if (line.indexOf("function") != -1) {
		function_name = line.split(" ");
		parseFunction(function_name[1],);
		return true;
	}
};

function parseFunction(line) {

}

function isLoop(line) { 

};



for (i = 0; i < numberOfLines; i++) {
	var line = lines[i]
	//Check if Comment?

	//Check if Function

	//Check if Loop


};