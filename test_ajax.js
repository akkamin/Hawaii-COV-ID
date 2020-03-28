var data;
$(document).ready(function() {
	$.ajax({
	  type: "GET",  
	  url: "data/timeseries/timeseries.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		data = $.csv.toArrays(response);
        console.log('hi there');
		console.log(data);
	  }   
	});
    
});
