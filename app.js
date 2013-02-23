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

app.post("/answer", function(request, response) {
  datastore[request.body.question] = { 
    "answer": request.body.answer,
    "date": new Date()
  };
  writeFile("data.txt", JSON.stringify(datastore));
  response.send({ question:{
    interpreted: request.body.question,
    answer: request.body.answer,
    date: new Date(),
    success: true },
    success: true});
});

app.post("/login", function(request, response) {
	username = request.body.user
	if (database[username] === undefined) { // User not found, make new user
		database[username] = {}
	}

	else { // User exists, bring to homepage

	}

	response.send
}