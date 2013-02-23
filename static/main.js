var localStorage // Holds the information for the user's files

function compileCode () {
  console.log("Sending!");
  var js_code = $("#js_code").val();
  var compilation_level = $("#compilation_level").val();
  var output_format = $("#output_format").val();
  var output_info = $("#output_info").val();
  compile(js_code, compilation_level, output_format);
}

function compile(js_code, compilation_level, output_format) {
  $.ajax({
    type: "post",
    dataType: "json",
    data: {'js_code' : js_code, 'compilation_level':compilation_level, 'output_format':output_format, 'output_info':"compiled_code", 'formatting':"pretty_print"},
    url: "http://closure-compiler.appspot.com/compile",
    success: function (data) {
      console.log(data.compiledCode);

      updateCompiledCode(data.compiledCode);

      console.log("Sent!");
    },
    error: function () {

      updateCompiledCode(data.compiledCode);

      console.log("Error getting code");
    },
  });
}

function updateCompiledCode(code) {
  $("#optimized_code").html(code);
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


function moveUp() {
  $("#file_select").slideUp();
}