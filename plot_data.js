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
var datacategories = ['positives', 'deaths', 'hospitalizations'];

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
            
            for (var p=0; p<3; p++){
                createAggregated(p, keys, dataArr);
                createAggregatedByDay(p, keys, dataArr);
                
                addIslandNavBarItemAgg(dataCategories[p] + '_by_day');
                addIslandNavBarItemAgg(dataCategories[p]);
                
                addIslandNavBarItemAgg(dataCategories[p] + '_by_day');
                addCategoryNavBarItemAgg(dataCategories[p]);
            }
            
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
                $('#categoriesNavigation').children().each(function () {
                    $(this).children().each(function(){
                        $(this).removeClass('active');
                    });
                });
                $(this).addClass('active');
            });
            
            $('#categoriesNavigation').children().each(function () {
                $(this).hide();
            });
        }   
    });    
});

function addIslandNavBarItem(dataRowName){
    var islandId = dataRowName.replace(/ /g, "").toLowerCase();
    var islandName = '';
    var labelName = '';
    for(var i=0; i<countyNames.length; i++){
        if(dataRowName.toLowerCase().indexOf(countyNames[i]) != -1){
            islandName = countyNames[i];
            break;
        }
    }
    if($('#' + islandName + 'listItem').length === 0){
        labelName = islandName.substring(0,1).toUpperCase() + islandName.substring(1,islandName.length);
        jQuery('<li/>', {
            id: islandName + 'listItem',
            class: "nav-item"
        }).appendTo('#islandNavigation');
        
        jQuery('<a/>', {
            id: islandName + 'Label',
            class: "nav-link",
            text: labelName,
            click: function() {
                $('#allGraphs').children().each(function () {
                    $(this).hide();
                });
                $('#categoriesNavigation').children().each(function () {
                    $(this).hide();
                });
                $("#" + islandName + "Navigation").show();
                $("#" + islandId).show();
            }
        }).appendTo('#' + islandName + 'listItem');
    }
}

function addIslandNavBarItemAgg(dataRowName){
    var islandId = dataRowName;
    var islandName = dataRowName;
    var labelName = '';

    if($('#' + islandName + 'listItem').length === 0){
        labelName = islandName.substring(0,1).toUpperCase() + islandName.substring(1,islandName.length);
        jQuery('<li/>', {
            id: islandName + 'listItem',
            class: "nav-item"
        }).appendTo('#islandNavigation');
        
        jQuery('<a/>', {
            id: islandName + 'Label',
            class: "nav-link",
            text: labelName,
            click: function() {
                $('#allGraphs').children().each(function () {
                    $(this).hide();
                });
                $('#categoriesNavigation').children().each(function () {
                    $(this).hide();
                });
                $("#" + islandName + "Navigation").show();
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
        var newList = jQuery('<ul/>').appendTo('#categoriesNavigation');
        newList.attr('id', islandName + 'Navigation');
        newList.addClass("nav nav-pills");
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

function addCategoryNavBarItemAgg(dataRowName){
    var islandId = dataRowName;
    var islandName = dataRowName;

    if($('#' + islandName + 'Navigation').length === 0){
        var newList = jQuery('<ul/>').appendTo('#categoriesNavigation');
        newList.attr('id', islandName + 'Navigation');
        newList.addClass("nav nav-pills");
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


function createAggregatedByDay(startNumb, xVals, dataArr){
    var prevDayTot = 0;
    var counter = (startNumb * 5) + 2
    var newDivName = dataCategories[startNumb];
    
    var data = [];
    for(var k=counter; k<counter+4; i++){
        var yVals = dataArr[k];
        var xValsData = xVals.slice(1,xVals.length);
        var yValsData = yVals.slice(1,yVals.length);
        
        for(var i=0; i<yValsData.length; i++){
            var increasedAmt = yValsData[i] - prevDayTot;
            //console.log(increasedAmt);
            yValsByDay.push(increasedAmt);
            prevDayTot = yValsData[i];
        }

        var byDay = {
            name: newDivName + ' By Day',
            x: xValsData,
            y: yValsByDay,
            type: 'scatter'
        };

        var data.push(byDay);
    }
    
    jQuery('<div/>', {
        id: newDivName + '_by_day'
    }).appendTo('#allGraphs');
    
    Plotly.newPlot(newDivName, data);
}


function createAggregated(startNumb, xVals, dataArr){
    var prevDayTot = 0;
    var counter = (startNumb * 5) + 2
    var newDivName = dataCategories[startNumb];
    
    var data = [];
    for(var k=counter; k<counter+4; i++){
        var yVals = dataArr[k];
        var xValsData = xVals.slice(1,xVals.length);
        var yValsData = yVals.slice(1,yVals.length);

        var total = {
            name: yVals[0] + ' Total',
            x: xValsData,
            y: yValsData,
            type: 'scatter'
        };

        var data.push(total);
    }
    
    jQuery('<div/>', {
        id: newDivName
    }).appendTo('#allGraphs');
    
    Plotly.newPlot(newDivName, data);
}