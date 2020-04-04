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
var countyNames = ['total','honolulu', 'maui', 'kauai', 'hawaii'];

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
            for (var i=1; i<16; i++){
                values.push(dataArr[i]);
                createGraph(keys, dataArr[i]);
                addIslandNavBarItem(dataArr[i][0]);
                addCategoryNavBarItem(dataArr[i][0]);
            }
            jQuery(".nav-item").on('click', function(){
                $('#islandNavigation').children().each(function (){
                    $(this).removeClass('active'); 
                });
                $(this).addClass('active');
            });
        }   
    });    
});

function addIslandNavBarItem(dataRowName){
    var islandId = dataRowName.replace(/ /g, "").toLowerCase();
    var islandName = '';
    for(var i=0; i<countyNames.length; i++){
        if(dataRowName.toLowerCase().indexOf(countyNames[i]) != -1){
            islandName = countyNames[i];
            break;
        }
    }
    if($('#' + islandName + 'listItem').length === 0){
        jQuery('<li/>', {
            id: islandName + 'listItem',
            class: "nav-item"
        }).appendTo('#islandNavigation');

        jQuery('<a/>', {
            id: islandName + 'Label',
            class: "nav-link",
            text: islandName,
            click: function() {
                $('#allGraphs').children().each(function () {
                    $(this).hide();
                });
                $('#islandNavigation').children().each(function () {
                    $(this).hide();
                });
                $("#" + islandName + "navigation").show();
                $("#" + islandId).show();
            }
        }).appendTo('#' + islandName + 'listItem');
    }
}

function addCategoryNavBarItem(dataRowName){
    var islandId = dataRowName.replace(/ /g, "").toLowerCase();
    var islandName = '';
    for(var i=0; i<countyNames.length; i++){
        if(dataRowName.toLowerCase().indexOf(countyNames[i]) != -1){
            islandName = countyNames[i];
            
            break;
        }
    }
    if($('#' + islandName + 'Navigation').length === 0){
        console.log(dataRowName);
        var newList = jQuery('<ul/>').appendTo('#navContainer');
        newList.attr('id', islandName + 'Navigation');
        newList.addClass("nav nav-pills");
        
        /*
        var newList = jQuery('ul/', {
           id: islandName + 'Navigation',
            class: "nav nav-pills"
        });
        jQuery('#navContainer').append(newList);
        */
    }
    
    jQuery('<li/>', {
        id: islandId + 'listItem',
        class: "nav-item"
    }).appendTo('#' + islandName + 'Navigation');

    jQuery('<a/>', {
        id: islandId + 'Label',
        class: "nav-link",
        text: dataRowName,
        click: function() {
            $('#allGraphs').children().each(function () {
                $(this).hide();
            });
            $("#" + islandId).show();
        }
    }).appendTo('#' + islandId + 'listItem');
    
    
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
