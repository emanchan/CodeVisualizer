$(document).ready(function () {
	var resize= $("#lpanel");
	var contentWidth = $("#content").width();
	var maxLeftPanelWidth = $("#content").width() - 50;

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
		maxLeftPanelWidth = $("#content").width() - 50;
		$("#rpanel").width(contentWidth - $("#lpanel").width());
	});
});