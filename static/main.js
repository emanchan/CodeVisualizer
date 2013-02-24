// This file handles AJAX and events
var localDatabase = {}; // Holds the information for the user's files
var currentUser = "testUser";

function getFiles(username) {
  $.ajax({
    type: "get",
    dataType: "json",
    url: "/files/" + encodeURI(username),
    success: function (data) {
      localDatabase = data.files;
      console.log(localDatabase);
    }
  });
}

function generateFileSelector() {
  for (file in localDatabase) {
    var fileSelector = $("#file_selector"); // Create div for individual file
    fileSelector.append("<div>").append("<p>").html(file);
  }
}

function createFile(filename) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {
      "currentUser": currentUser,
      "filename": filename,
      "text": "// Enter Your Code Here"
    },
    url: "/create/",
    success: function (data) {
      localDatabase[filename] = "// Enter Your Code Here";
    },
    error: function(xhr) {
      alert(xhr.responseText);}
  });generateFileSelector
}

function login() {
  var userId = $("#login_input").val().toLowerCase();
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'username' : userId},
    url: "/login",
    success: function (data) { // On success, set currentUser to username and hid login div
      currentUser = data.username;
      $("#login_div").hide(250);
    }
  });
}

// ***Run when document is ready***

$(document).ready(function () {
  var resize= $("#lpanel");
	var contentWidth = $("#content").width();
	var maxLeftPanelWidth = contentWidth - 60;

	$("#lpanel").resizable({
      handles: 'e',
      maxWidth: maxLeftPanelWidth,
      minWidth: 200,
      resize: function(event, ui){
          var currentWidth = ui.size.width;
          var padding = 12; 
          $(this).width(currentWidth);
          $("#rpanel").width(contentWidth - currentWidth);            
      }
	});

	$(window).resize(function() {
		contentWidth = $("#content").width();
		maxLeftPanelWidth = contentWidth - 50;
		$("#lpanel").resizable("option","maxWidth",maxLeftPanelWidth);
		$("#rpanel").width(contentWidth - $("#lpanel").width());
	});

  //Handles switching between code info and visualizer in right panel
  $("#visualizer").click(function () {
    if($("#code_content" === undefined)){
      var info = $("#info_area").empty();
      var canvas = $("<canvas>");
      canvas.attr("id","myCanvas");
      canvas.html("No canvas available!");
      info.append(canvas);
      console.log("Change!");
    }
  });

  $("#code_info").click(function () {
    if($("#myCanvas" === undefined)){
      var info = $("#info_area").empty();
      var codeContent = $("<textarea disabled>");
      codeContent.attr("id","code_content");
      codeContent.html("Optimized_Code");
      info.append(codeContent);
      console.log("Change!");
    }
  });

  // Hide file_select div, only show it when user needs to select file

  $("#file_select").hide(0);
  getFiles(currentUser); // on load get currentUser files

});