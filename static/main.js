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

function createFile() {
  var filename = $("#filename_input").val();
  $("#filename_input").val("");
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
        "statistics": "",
        "warnings": "",
        "date": new Date()
      };
      // set current file to newly created file
      currentFile = filename;
      console.log(localDatabase[filename].text);
      $("#js_code").val(localDatabase[filename].text);
      $("#code_content").val(localDatabase[filename].compiled_code);
      $("#stats_text").val(localDatabase[filename].statistics);
      $("#warning_text").val(localDatabase[filename].warnings);
    },
    error: function(xhr) {
      alert("A file with that name already exists!")}
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
      "statistics": localDatabase[filename].statistics,
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
      $("#navbar").show(0);
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
  });

  $("#submitCode").click(function () {
    sendCode();
  });

  $("#saveCode").click(function () {
    updateFile(currentFile);
  });

  // Hide file_select div, only show it when user needs to select file
  $("#navbar").hide(0)
});;