//This file interactes with google closure compler and update DOM

function sendCode () {
  var js_code = $("#js_code").val();
  var compilation_level = $("#editor_area input[type='radio']:checked").val();
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
        if(tempFile === '0'){
          localDatabase[currentFile].compiled_code = data.compiledCode;
        }
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
        if(tempFile === '0'){
          localDatabase[currentFile].compiled_code = data.errors;
        }
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
      if(data.warnings !== undefined){
        var warningMSG = "";
        for(var i = 0; i < data.warnings.length; i++) {
          warningMSG += "Line: " + data.warnings[i].lineno + '\n';
          warningMSG += "  " + data.warnings[i].warning + '\n';
        }
        $("#warning_area p").html(warningMSG);

        if(tempFile === '0'){
          localDatabase[currentFile].warnings = warningMSG;
        }
      } else {
        $("#warning_area p").html("No warnings");
        if(tempFile === '0'){
          localDatabase[currentFile].warnings = "No warnings";
        }
      }
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
      if(data.statistics !== undefined) {
        var statMSG = "Original size: " + data.statistics.originalSize + "<br>";
        statMSG += "Compressed size: " + data.statistics.compressedSize + "<br>";
        statMSG += "Compile Time: " + data.statistics.compileTime;
        $("#stat_area p").html(statMSG);
        if(tempFile === '0'){
          localDatabase[currentFile].statistics = statMSG;
        }
      } else {
        $("#stat_area p").html("No statistics");
        if(tempFile === '0'){
          localDatabase[currentFile].statistics = "No statistics";
        }
      }
    }
  });
}