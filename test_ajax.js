var dataArr;
var dataObj;
$(document).ready(function() {
	$.ajax({
	  type: "GET",  
	  url: "data/timeseries/timeseries.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		dataObj = $.csv.toObjects(response);
        dataArr = $.csv.toArrays(response);
        console.log('hi there');
		console.log(dataObj);
        console.log(dataArr);
	  }   
	});
    
});
