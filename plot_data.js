var keys = [];
var values = [];

$(document).ready(function() {
    for (const element of covid19Data){
        //console.log(element["Province/State"]);
        if(element["Province/State"] === 'Hawaii' && element["Country/Region"] === 'US'){
            console.log(element);
            keys = Object.keys(element);
            values = Object.values(element);
            //console.log(keys);
            //console.log(values);
            break;
        }
    }
    var combinedData = filterValues(keys, values);
    createGraph(combinedData);
    
});



function createGraph(values){
    var xVals = [];
    var yVals = [];
    
    var yValsByDay = [];
    var prevDayTot = 0;
    
    for(var i = 0; i<values.length; i++){
        xVals.push(values[i][0]);
        yVals.push(values[i][1]);
        var increasedAmt = values[i][1] - prevDayTot;
        console.log(increasedAmt);
        yValsByDay.push(increasedAmt);
        prevDayTot = values[i][1];
    }
    var total = {
        name: 'Total',
        x: xVals,
        y: yVals,
        type: 'scatter'
    };
    
    var byDay = {
        name: 'By Day',
        x: xVals,
        y: yValsByDay,
        type: 'scatter'
    };
    
    var data = [total, byDay];
    Plotly.newPlot('myDiv', data);
}

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