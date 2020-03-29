var keys = [];
/*
totalPositive 0
honoluluPositive 1
mauiPositive 2
kauaiPositive 3
bigIslandPositive 4
unknownPositives 5
hospitalizations 6
*/
var dataArr;
var values = [];

$(document).ready(function() {
    $.ajax({
        type: "GET",  
        url: "data/timeseries/timeseries.csv",
        dataType: "text",       
        success: function(response)  
        {
            //dataObj = $.csv.toObjects(response);
            dataArr = $.csv.toArrays(response);
            keys = dataArr[0];
            console.log(dataArr);
            for (var i=1; i<9; i++){
                if(i !== 6 && i !== 7){
                    values.push(dataArr[i]);
                    createGraph(keys, dataArr[i]);
                    addNavBarItem(dataArr[i][0]);
                }
            }
            jQuery(".nav-link").on('click', ){
                $('#islandNavigation').children().each(function (){
                    $(this).children().removeClass('active'); 
                });
                $(this).addClass('active');
            }
        }   
    });    
});

function addNavBarItem(dataRowName){
    var islandName = dataRowName.replace(/ /g, "").toLowerCase();
    jQuery('<li/>', {
        id: islandName + 'listItem',
        class: "nav-item"
    }).appendTo('#islandNavigation');
    
    jQuery('<a/>', {
        id: islandName + 'Label',
        class: "nav-link"
        text: dataRowName,
        click: function() {
            $('#allGraphs').children().each(function () {
                $(this).hide();
            });
            $("#" + islandName).show();
        }
    }).appendTo('#' + islandName + 'listItem');
        
}

function createGraph(xVals, yVals){
    
    var yValsByDay = [];
    var prevDayTot = 0;
    
    var newDivName = yVals[0].replace(/ /g, "").toLowerCase();
    
    var xValsData = xVals.slice(1,xVals.length);
    var yValsData = yVals.slice(1,yVals.length);
    for(var i=0; i<yValsData.length; i++){
        var increasedAmt = yValsData[i] - prevDayTot;
        //console.log(increasedAmt);
        yValsByDay.push(increasedAmt);
        prevDayTot = yValsData[i];
    }
    var total = {
        name: yVals[0] + ' Total',
        x: xValsData,
        y: yValsData,
        type: 'scatter'
    };
    
    var byDay = {
        name: yVals[0] + ' By Day',
        x: xValsData,
        y: yValsByDay,
        type: 'scatter'
    };
    
    jQuery('<div/>', {
        id: newDivName
    }).appendTo('#allGraphs');
    
    var data = [total, byDay];
    Plotly.newPlot(newDivName, data);
}


//not used
function filterValues(xVals, yVals){
    var filteredVals = [];
    var startingDate = false;
    for (var i = 4; i<yVals.length; i++){
        if(!startingDate){
            if(yVals[i] > 0){
                startingDate = true;
            }
        }
        
        if(startingDate){
            var tempDate = xVals[i].split('/');
            var tempDateString = '20' + tempDate[2] + '-' + tempDate[0] + '-' + tempDate[1]; 
            filteredVals.push([tempDateString, yVals[i]]);
        }
    }
    return filteredVals;
}
