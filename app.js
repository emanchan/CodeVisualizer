// Server for CodeVisualizer

var express = require("express"); // imports express
var app = express();        // create a new instance of express

// imports the fs module (reading and writing to a text file)
var fs = require("fs");

// the bodyParser middleware allows us to parse the
// body of a request
app.use(express.bodyParser());


// [username] = {nameOfFile : file, nameOfFile2 : file2, ... : ...}
database = {}


// Asynchronously read file contents, then call callbackFn
function readFile(filename, defaultData, callbackFn) {
  fs.readFile(filename, function(err, data) {
    if (err) {
      log.console("Error reading file: ", filename);
      data = defaultData;
    } else {
      console.log("Success reading file: ", filename);
    }
    if (callbackFn) callbackFn(err, data);
  });
}

// Asynchronously write file contents, then call callbackFn
function writeFile(filename, data, callbackFn) {
  fs.writeFile(filename, data, function(err) {
    if (err) {
      console.log("Error writing file: ", filename);
    } else {
      console.log("Success writing file: ", filename);
    }
    if (callbackFn) callbackFn(err);
  });
}

// Login post
app.post("/login", function(request, response) {
	var username = request.body.username
	if (database[username] === undefined) { // User not found, make new user
		database[username] = {};
		console.log(database);
		response.send({
			username: username,
			success: true});
	}

	else { // User exists, bring to homepage
		console.log(database);
		response.send({
			username: username,
			success: true});
	}

	// Save ndatabase to file
	writeFile("data.txt", JSON.stringify(database));
});

app.get("/files/:username", function(request, response) {
	var username = decodeURI(request.params.username)
	response.send({ // Send back file data
		files: database[username],
		success: true
	});
});

app.post("/create", function(request, response) {
	var filename = request.body.filename;
	var currentUser = request.body.currentUser;

	if (database[currentUser][filename] !== undefined) {// File exists, return error to user
		response.send(500, { error: "File already exists" });
	}
	else { // Create file and add text
		database[currentUser][filename] = {
			text: "// Enter Your Code Here",
			date: request.body.dateCreated,
			compiled_code: "",
			statistics: "",
			warnings: ""
		};
		response.send({ success:true });
		console.log(database);
		writeFile("data.txt", JSON.stringify(database));
	}
});

app.post("/save", function(request, response) {
	var filename = request.body.filename;
	var currentUser = request.body.currentUser;

	if(database[currentUser][filename] !== undefined){
		var savedDate = database[currentUser][filename].date;
		database[currentUser][filename] = {
		text: request.body.text,
		date: savedDate,
		compiled_code: request.body.compiled_code,
		statistics: request.body.statistics,
		warnings: request.body.warnings
	};
	response.send({ success:true });
	console.log(database);
	writeFile("data.txt", JSON.stringify(database));
	}
});

app.get("/static/:staticFilename", function (request, response) {
    response.sendfile("static/" + request.params.staticFilename);
});

app.get("/static/reveal/:staticFilename", function (request, response) {
    response.sendfile("static/reveal/" + request.params.staticFilename);
});

function initServer() {
	// When we start the server, we must load the stored data
	var defaultList = "{}";
	readFile("data.txt", defaultList, function(err, data) {
		console.log(data);
	 	database = JSON.parse(data);
	 	console.log(database);
	});
	
}

initServer();
app.listen(8889);