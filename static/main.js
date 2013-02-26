// This file handles AJAX and events
var localDatabase = {}; // Holds the information for the user's files
var currentUser = "";
var currentFile = "";
var tempFile = '1';

function getFiles(username) {
  $.ajax({
    type: "get",
    dataType: "json",
    url: "/files/" + encodeURI(username),
    success: function (data) {
      localDatabase = data.files;
    }
  });
}

function generateFileSelector() {
  // Clear previous generated file selector
  $("#file_select").html("");

  for (var filename in localDatabase) {
    var file = localDatabase[filename];
    console.log(filename);

    var fileSelector = $("#file_select"); // Create div for individual file

    // Create new div for each file and add click event to it
    var newDiv = $("<div>").addClass("file_row").addClass("closer").attr("id", filename).click(function() {
      // Load the file into the workspace
      currentFile = $(this).attr("id"); // set the currentFile to file clicked
      // Load code, optimized code, warnings
      $("#js_code").val(localDatabase[filename].text);
      $("#code_content").val(localDatabase[filename].compiled_code);
      $("#stats_text").val(localDatabase[filename].statistics);
      $("#warning_text").val(localDatabase[filename].warnings);
    });

    newDiv.append("<p>").text(filename+ " " + file["date"]); // Add date    
    fileSelector.append(newDiv); // Add div to fileSelector
  }
  var closeButton = $("<a>").html("&#215;").addClass("close-reveal-modal").addClass("closer");
    $("#file_select").append(closeButton);


  $("#file_select").reveal({
    animation: 'fade',
    animationspeed: 200,
    closeonbackgroundclick: true,
    dismissmodalclass: 'closer'
  });
}

function displayCreateFile() {
  // Display prompt to enter filename
  var popup = $("#create_file_popup");
  popup.reveal({
    animation: 'fade',
    animationspeed: 200,
    closeonbackgroundclick: true,
    dismissmodalclass: 'closer'
  });
}

function createFilePopup(){
  createFile($("#filename_input").val());
  $("#filename_input").val("");
}

function createFile(filename) {
  if (filename === "")
    return;
  $.ajax({
    type: "post",
    dataType: "json",
    data: {
      "currentUser": currentUser,
      "dateCreated": new Date(),
      "filename": filename,
    },
    url: "/create/",
    success: function (data) {
      getFiles(currentUser);
      currentFile = filename;
      console.log(localDatabase[filename].text);
      $("#js_code").val(localDatabase[filename].text);
      $("#code_content").val(localDatabase[filename].compiled_code);
      $("#stats_text").val(localDatabase[filename].statistics);
      $("#warning_text").val(localDatabase[filename].warnings);
      $("#new_filename_input").html(currentFile);
      $("#status").html("Created " + currentFile);
    },
    error: function(xhr) {
      alert("A file with that name already exists!")}
  });
}

function updateFile(filename) {
  $.ajax({
  type: "post",
  dataType: "json",
  data: {
    "currentUser": currentUser,
    "filename": filename,
    "text": localDatabase[filename].text,
    "compiled_code": localDatabase[filename].compiled_code,
    "statistics": localDatabase[filename].statistics,
    "warnings": localDatabase[filename].warnings
  },
  url: "/save/",
  error: function(xhr) {
    alert(xhr.responseText)}
  });
}

function login() {
  var userId = $("#login_input").val().toLowerCase();
  var checkUsername = /^[A-Za-z0-9_]{3,20}$/;

  if (!checkUsername.test(userId)) // If regex isn't matched, don't continue
    return;
  currentUser = userId;
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'username' : userId},
    url: "/login",
    success: function (data) { // On success, set currentUser to username, hid login div, and get files
      currentUser = data.username;
      getFiles(currentUser);
      $("#navbar").show(0);
      $("#login_div").hide(250);
      $("#user").html("Welcome " + currentUser + "!");
      $("#userbar").show(0);
      localDatabase[currentFile] = {
        "text": "// Enter Your Code Here",
        "compiled_code": "Haven't compiled any code",
        "statistics": "No statistics",
        "warnings": "No warnings",
        "date": new Date()
      };

      $("#logout_button").html("Logout").click(function() { // Log out action
        currentUser = "";
        $("#navbar").hide(25);
        $("#userbar").hide(50);
        $("#login_div").show(25);
        localDatabase = {};
      })
    }
  });
}

// ***Run when document is ready***

$(document).ready(function () {
      var resize= $("#lpanel");
	var contentWidth = $("#content").width();
	var maxLeftPanelWidth = contentWidth - 50;
      var padding = 1 + 40;

	$("#lpanel").resizable({
      handles: 'e',
      maxWidth: maxLeftPanelWidth,
      minWidth: 200,
      resize: function(event, ui){
          var currentWidth = ui.size.width;
      
          $(this).width(currentWidth);
          $("#rpanel").width(contentWidth - currentWidth - padding);            
      }
	});

	$(window).resize(function() {
		contentWidth = $("#content").width();
		maxLeftPanelWidth = contentWidth - 50;
		$("#lpanel").resizable("option","maxWidth",maxLeftPanelWidth);
		$("#rpanel").width(contentWidth - $("#lpanel").width() - padding - 1);
	});

  //Handles switching between code info and visualizer in right panel
  $("#visualizer").click(function () {
    if($("#code_content" === undefined)){
      $("#visualizer").css("font-weight", "bold");
      $("#code_info").css("font-weight", "normal");
      var info = $("#info_area").empty();
          (function(){

var test = "function x(a,b) { \n return FX(2);\n}\n\nfunction FX(x) { \n return 4;\n}"
//var javascript_text = localDatabase[filename].compiled_code;
var functionHash = Parse(test);
console.log("functionHash = ", functionHash);

function relationships(functionHash){
console.log("Function: relationships called");
var links = new Array();
for (var key in functionHash) {
  console.log("key = ", key);
  var object = functionHash[key];
  var functionName = object.name;
  var children = object.children; 
  console.log("children = ", object.children);
  object.children.forEach(function(x) {
      var relationship = new Object();
      relationship["source"] = functionName;
      relationship["target"] = x.name;
      relationship["type"] = "suit";
      console.log("relationship = ", relationship);
      links.push(relationship);
    });

  }   
  return links;
}

var links = relationships(functionHash);
console.log("links = ", links);
var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
});

var w = 960,
    h = 500;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([w, h])
    .linkDistance(60)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("#info_area").append("svg:svg")
    .attr("width", w)
    .attr("height", h);

// Per-type markers, as they don't inherit styles.
svg.append("svg:defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("svg:marker")
    .attr("id", String)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", -1.5)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
  .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("svg:g").selectAll("path")
    .data(force.links())
  .enter().append("svg:path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

var circle = svg.append("svg:g").selectAll("circle")
    .data(force.nodes())
  .enter().append("svg:circle")
    .attr("r", 6)
    .call(force.drag);

var text = svg.append("svg:g").selectAll("g")
    .data(force.nodes())
  .enter().append("svg:g");

// A copy of the text with a thick white stroke for legibility.
text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .attr("class", "shadow")
    .text(function(d) { return d.name; });

text.append("svg:text")
    .attr("x", 8)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", function(d) {
    var dx = d.target.x - d.source.x,
        dy = d.target.y - d.source.y,
        dr = Math.sqrt(dx * dx + dy * dy);
    return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
  });

  circle.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });

  text.attr("transform", function(d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}
}).call(this);

(function(){

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatPercent);

var svg = d3.select("#info_area").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(error, data) {

  data.forEach(function(d) {
    d.frequency = +d.frequency;
  });

  x.domain(data.map(function(d) { return d.letter; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.letter); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.frequency); })
      .attr("height", function(d) { return height - y(d.frequency); });
  });
}).call(this);
}
});



  //Handles switching between code info and visualizer in right panel
  $("#code_info").click(function () {
    if($("#myCanvas" === undefined)){
      $("#code_info").css("font-weight", "bold");
      $("#visualizer").css("font-weight", "normal");
      var info = $("#info_area").empty();
      var codeContent = $("<textarea disabled>").attr("id","code_content");
      codeContent.html("Optimized_Code");

      var statArea = $("<div>").attr("id","stat_area");
      statArea.html($("<h3>").html("Statistics:").append($("<p>").attr("id", "stats_text").html("No statistics")));

      var infoArea = $("<div>").attr("id","warning_area");
      infoArea.html($("<h3>").html("Warnings:").append($("<p>").attr("id", "warning_text").html("No warnings")));

      info.append(codeContent);
      info.append(statArea);
      info.append(infoArea);
    }
  });

  $("#create_button").click(function() {
    displayCreateFile();
  });

  $("#load_button").click(function() {
    generateFileSelector();
    $("#new_filename_input").html(currentFile);
    $("#status").html("Loaded " + currentFile);
  });

  $("#submitCode").click(function () {
    $("#status").html("Compiling..." );
    sendCode();
    $("#status").html("Compiled " + currentFile);
  });

  $("#saveCode").click(function () {
    if($("#new_filename_input").val() === "") {
      $("#status").html("Please enter a valid filename");
    } else if(tempFile === '1'){
      currentFile = $("#new_filename_input").val();
      $("#status").html("Saving");
      createFile(currentFile);
      updateFile(currentFile);
      $("#new_filename_input").val(currentFile);
      $("#status").html("Saved " + currentFile);
      tempFile = '0';
    } else {
      updateFile(currentFile);
    }
  });


  // Hide file_select div, only show it when user needs to select file
  $("#navbar").hide(0)
});;