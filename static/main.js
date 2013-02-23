// This file handles AJAX and events

//Sends code to google closure compiler
function sendCode () {
  console.log("Sending!");
  var js_code = $("#js_code").val();
  var compilation_level = $("#compilation_level").val();
  var output_format = $("#output_format").val();
  compileCode(js_code, compilation_level);
  getErrors(js_code, compilation_level);
}

//Retrives compiled code
function compileCode(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"compiled_code", 'formatting':"pretty_print"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      updateCompiledCode(data.compiledCode);
    },
    error: function () {
      updateCompiledCode(data);
      console.log("Error getting code");
    },
  });
}

function getErrors(js_code, compilation_level) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':"json", 'output_info':"errors"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      // conssole.log(data.errors[0].error);
      for(var i = 0; i < data.errors.length; i++) {
        console.log(data.errors[i].error);
      }
    },
    error: function () {
      updateCompiledCode(data);
      console.log("Error getting code");
    },
  });
}

function updateCompiledCode(code) {
  $("#optimized_code").html(code);
}

$(document).ready(function () {
  var resize= $("#lpanel");
	var contentWidth = $("#content").width();
	var maxLeftPanelWidth = contentWidth - 50;

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
});