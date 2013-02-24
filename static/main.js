// This file handles AJAX and events
var localStorage; // Holds the information for the user's files
var currentUser = "testUser";

//Sends code to google closure compiler
function sendCode () {
  console.log("Sending!");
  var js_code = $("#js_code").val();
  var compilation_level = $("#compilation_level").val();
  var output_format = $("#output_format").val();
  compileCode(js_code, compilation_level);
}

function compileCode(js_code, compilation_level) {
  getCompiledCode(js_code, compilation_level);
  getErrors(js_code, compilation_level);
  getWarnings(js_code, compilation_level);
  getStatistics(js_code, compilation_level);
  updateCompiledCode();
}

//Retrives compiled code and checks for server errors
function getCompiledCode(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"compiled_code", 'formatting':"pretty_print"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      if(data.compiledCode === undefined){
        return data.serverErrors[0].error;
      } else {
        return data.compiledCode;
      }
      console.log("sent!");
    }
  });
}

//Retrives errors if there are any
function getErrors(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"errors"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      if(data.errors !== undefined){
        var errorMSG = "Compile errors:\n";
        for(var i = 0; i < data.errors.length; i++) {
          errorMSG += "Line: " + data.errors[i].lineno + '\n';
          errorMSG += "  " + data.errors[i].error + '\n';
        }
        return errorMSG;
      }
    }
  });
}

function getWarnings(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"warnings"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      //TODO
    }
  });
}

function getStatistics(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"statistics"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      //TODO
    }
  });
}

function updateCompiledCode(code) {
  $("#code_content").html(code);
}

function getFiles(username) {
  $.ajax({
    type: "get",
    dataType: "json",
    url: "/files/" + encodeURI(username),
    success: function (data) {
      localStorage = data.files;
    }
  });
}

function generateFileSelector() {
  for (file in localStorage) {
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
      localStorage[filename] = "// Enter Your Code Here";
    },
    error: function(xhr) {
      alert(xhr.responseText);}
  });
}

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
          
          // this accounts for padding in the panels + 
          // borders, you could calculate this using jQuery
          var padding = 12; 
          
          // this accounts for some lag in the ui.size value, if you take this away 
          // you'll get some instable behaviour
          $(this).width(currentWidth);
          
          // set the content panel width
          $("#rpanel").width(contentWidth - currentWidth);            
      }
	});

	$(window).resize(function() {
		contentWidth = $("#content").width();
		maxLeftPanelWidth = contentWidth - 50;
		$("#lpanel").resizable("option","maxWidth",maxLeftPanelWidth);
		$("#rpanel").width(contentWidth - $("#lpanel").width());
	});

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
});