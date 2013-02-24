//This file interactes with google closure compler and update DOM

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
         $("#code_content").html(data.serverErrors[0].error);
      } else {
        $("#code_content").html(data.compiledCode);
      }
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
        $("#code_content").html(errorMSG);
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