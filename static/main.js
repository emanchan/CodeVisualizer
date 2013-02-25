// This file handles AJAX and events
var localDatabase = {}; // Holds the information for the user's files
var currentUser = "";
var currentFile = "";

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
  for (var filename in localDatabase) {
    var file = localDatabase[filename];
    console.log(filename);

    var fileSelector = $("#file_select"); // Create div for individual file

    // Create new div for each file and add click event to it
    var newDiv = $("<div>").addClass("file_row").attr("id", filename).click(function() {
      console.log("clicked");
      console.log($(this));
      // TODO add load file method
    });

    newDiv.append("<p>").text(filename+ " " + file["date"]);
    
    fileSelector.append(newDiv);
  }
  $("#file_select").reveal({
    animation: 'fade',
    animationspeed: 200,
    closeonbackgroundclick: true,
    dismissmodalclass: 'close-reveal-modal'
  });
}

function createFile() {
  // Display prompt to enter filename
  var popup = $("#create_file_popup");
  popup.reveal({
    animation: 'fade',
    animationspeed: 200,
    closeonbackgroundclick: true,
    dismissmodalclass: 'close-reveal-modal'
  });

  var filename = $("#login_input").val();
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
      localDatabase[filename] = {
        "text": "// Enter Your Code Here",
        "compiled_code": "",
        "warnings": "",
        "date": new Date()
      };
    },
    error: function(xhr) {
      alert(xhr.responseText)}
  });
}

function updateFile(filename) {
  if(canSave === '1'){
    $.ajax({
    type: "post",
    dataType: "json",
    data: {
      "currentUser": currentUser,
      "filename": filename,
      "text": localDatabase[filename].text,
      "compiled_code": localDatabase[filename].compiled_code,
      "warnings": localDatabase[filename].warnings
    },
    url: "/save/",
    error: function(xhr) {
      alert(xhr.responseText)}
    });
  }
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
      $("#login_div").hide(250);
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
      var canvas = $("<canvas>");
      canvas.attr("id","myCanvas");
      canvas.html("No canvas available!");
      info.append(canvas);
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
      statArea.html($("<h3>").html("Statistics:").append($("<p>").html("No statistics")));

      var infoArea = $("<div>").attr("id","warning_area");
      infoArea.html($("<h3>").html("Warnings:").append($("<p>").html("No warnings")));

      info.append(codeContent);
      info.append(statArea);
      info.append(infoArea);
    }
  });

  $("#submitCode").click(function () {
    sendCode();
  });

  $("#saveCode").click(function () {
    updateFile(currentFile);
  });

  // Hide file_select div, only show it when user needs to select file
});