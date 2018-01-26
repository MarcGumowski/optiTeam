///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// playerPerfChart
//
// Author : Marc Gumowski
//
// Description : Create a time series line chart of the player's performance. Possibility to decompose singular line by 
//               clicking on it into trend, periodicity and noise. 
//               
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var margin = { top: 20, left: 20, right: 20, bottom: 20 };
var width = 940 - margin.left - margin.right;
var height = 650 - margin.top - margin.bottom;

var div = d3.select('#playerChart').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0);

var svg = d3.select("#playerChart").append("svg")
    .attr('id', 'playerChartSvg')
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right);
    
var g = svg.append("g")
    .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");
    
var formatNumber = d3.format(".2f"),
    format = function(d) { return formatNumber(d); };  
    
    
    
    