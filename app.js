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

// Login post
app.post("/login", function(request, response) {
	var username = request.body.user
	if (database[username] === undefined) { // User not found, make new user
		database[username] = {};
		response.send({
			username: username,
			success: true});
	}

	else if { // User exists, bring to homepage
		response.send({
			username: username,
			success: true});
	}
}

app.get("/files/:username", function(request, response) {
	var username = decodeURI(request.params.username)
	response.send({ // Send back file data
		files: database[username],
		success: true
	});
}