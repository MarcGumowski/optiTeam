///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// optiTeam
//
// Author : Marc Gumowski
//
// Description : Get budget, run solver function (credit to https://github.com/JWally/jsLPSolver/), print results.
//               Data are stored in data/data.js under the name "model".
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
// Budget //////////////////////////////////////////////
////////////////////////////////////////////////////////

var budget = localStorage.getItem("budget");
// Check that budget is a number
budget = isNumeric(budget) ? budget : 135;
// Round it to the closest .5 decimal 
model.constraints.budget = {"max": (Math.floor(budget * 2) / 2).toFixed(1)}; 

////////////////////////////////////////////////////////
// Goalkeeper///////////////////////////////////////////
////////////////////////////////////////////////////////

var goalie = localStorage.getItem("goalie");
// Check that budget is a number
goalie = isNumeric(goalie) ? goalie : 2;
// Round it to the closest .5 decimal 
model.constraints.goalie = {"equal": (Math.floor(goalie * 2) / 2).toFixed(1)}; 

////////////////////////////////////////////////////////
// Defense//////////////////////////////////////////////
////////////////////////////////////////////////////////

var defense = localStorage.getItem("defense");
// Check that budget is a number
defense = isNumeric(defense) ? defense : 8;
// Round it to the closest .5 decimal 
model.constraints.defense = {"equal": (Math.floor(defense * 2) / 2).toFixed(1)}; 

////////////////////////////////////////////////////////
// Offense//////////////////////////////////////////////
////////////////////////////////////////////////////////

var offense = localStorage.getItem("offense");
// Check that budget is a number
offense = isNumeric(offense) ? offense : 12;
// Round it to the closest .5 decimal 
model.constraints.offense = {"equal": (Math.floor(offense * 2) / 2).toFixed(1)}; 

////////////////////////////////////////////////////////
// Foreign player///////////////////////////////////////
////////////////////////////////////////////////////////

var foreign = localStorage.getItem("foreign");
// Check that budget is a number
foreign = isNumeric(foreign) ? foreign : 4;
// Round it to the closest .5 decimal 
model.constraints.nat = {"max": (Math.floor(foreign * 2) / 2).toFixed(1)}; 

////////////////////////////////////////////////////////
// Solve ///////////////////////////////////////////////
////////////////////////////////////////////////////////

var results = solver.Solve(model);
console.log(results);

////////////////////////////////////////////////////////
// Find players ////////////////////////////////////////
////////////////////////////////////////////////////////

// Results as array
var compTemp = [];
for (var key in results) { 
  compTemp.push(key + ':' + results[key]); 
}
// Keep only players that have been selected
var regex = /:1/;
var comp  = $.grep(compTemp, function(player){
    return regex.test(player);
});
// Remove :1
var comp = comp.map(function(entry) {
    return entry.replace(regex, '');
});
// Find selected players in model and create array with
// their information
var optiTeam = [];
for (var i = 0; i < comp.length; ++i) {
  optiTeam.push(model.variables[comp[i]]);
}
for (var j = 0; j < comp.length; ++j) {
 optiTeam[comp[j]] = optiTeam[j];
 delete optiTeam[j];
}

////////////////////////////////////////////////////////
// Results /////////////////////////////////////////////
////////////////////////////////////////////////////////

// Points
var points = results.result;

// Invested
var invested = 0;
for (var k = 0; k < optiTeam.length; ++k) {
      invested += optiTeam[comp[k]].budget;
}

// Remaining
var remaining = round(budget - invested, 1);

// Foreign players
var foreigners = 0;
for (var l = 0; l < optiTeam.length; ++l) {
      foreigners += optiTeam[comp[l]].nat;
}

////////////////////////////////////////////////////////
// Print results ///////////////////////////////////////
////////////////////////////////////////////////////////

// Goalies
var html = "<h2>Goalkeeper</h2>" +
          "<table>" + 
            "<tr>" + 
              "<th>" + "Player" + "</th>" +
              "<th>" + "Team" + "</th>" +
              "<th>" + "Foreigner" + "</th>" +
              "<th>" + "Points" + "</th>" +
              "<th>" + "Price" + "</th>" +
            "</tr>";
for (var m = 0; m < optiTeam.length; ++m) {
  if (optiTeam[comp[m]].pos === "G") {
    html+="<tr>";
    html+="<td>"+ optiTeam[comp[m]].player +"</td>";
    html+="<td>"+ optiTeam[comp[m]].team +"</td>";
    if (optiTeam[comp[m]].nat === 1) {
     html+="<td>"+ "Yes" +"</td>"; 
    } else {
     html+="<td>"+ "No" +"</td>"; 
    }
    html+="<td>"+ optiTeam[comp[m]].points +"</td>";
    html+="<td>"+ optiTeam[comp[m]].budget +"</td>";
    html+="</tr>";
  }
}
html+="</table>";
document.getElementById("goalies").innerHTML = html;

// Defense                  
var html = "<h2>Defense</h2>" +
          "<table>" + 
            "<tr>" + 
              "<th>" + "Player" + "</th>" +
              "<th>" + "Team" + "</th>" +
              "<th>" + "Foreigner" + "</th>" +
              "<th>" + "Points" + "</th>" +
              "<th>" + "Price" + "</th>" +
            "</tr>";
for (var m = 0; m < optiTeam.length; ++m) {
  if (optiTeam[comp[m]].pos === "D") {
    html+="<tr>";
    html+="<td>"+ optiTeam[comp[m]].player +"</td>";
    html+="<td>"+ optiTeam[comp[m]].team +"</td>";
    if (optiTeam[comp[m]].nat === 1) {
     html+="<td>"+ "Yes" +"</td>"; 
    } else {
     html+="<td>"+ "No" +"</td>"; 
    }
    html+="<td>"+ optiTeam[comp[m]].points +"</td>";
    html+="<td>"+ optiTeam[comp[m]].budget +"</td>";
    html+="</tr>";
  }
}
html+="</table>";
document.getElementById("defense").innerHTML = html;

// Offense                  
var html = "<h2>Offense</h2>" +
          "<table>" + 
            "<tr>" + 
              "<th>" + "Player" + "</th>" +
              "<th>" + "Team" + "</th>" +
              "<th>" + "Foreigner" + "</th>" +
              "<th>" + "Points" + "</th>" +
              "<th>" + "Price" + "</th>" +
            "</tr>";
for (var m = 0; m < optiTeam.length; ++m) {
  if (optiTeam[comp[m]].pos === "F") {
    html+="<tr>";
    html+="<td>"+ optiTeam[comp[m]].player +"</td>";
    html+="<td>"+ optiTeam[comp[m]].team +"</td>";
    if (optiTeam[comp[m]].nat === 1) {
     html+="<td>"+ "Yes" +"</td>"; 
    } else {
     html+="<td>"+ "No" +"</td>"; 
    }
    html+="<td>"+ optiTeam[comp[m]].points +"</td>";
    html+="<td>"+ optiTeam[comp[m]].budget +"</td>";
    html+="</tr>";
  }
}
html+="</table>";
document.getElementById("offense").innerHTML = html;

// Team                  
var team = document.getElementById("team");
team.innerHTML = "<h2>Team</h2>" + 
                  "<table id=teamTable>" + 
                    "<tr>" + 
                      "<th>" + "Foreign players" + "</th>" +
                      "<th>" + "Budget" + "</th>" +
                      "<th>" + "Invested" + "</th>" +
                      "<th>" + "Remaining" + "</th>" +
                      "<th>" + "Points" + "</th>" +
                    "</tr>" + 
                    "<tr>" +
                      "<td>" + foreigners + "</td>" +
                      "<td>" + budget + "</td>" +
                      "<td>" + invested + "</td>" +
                      "<td>" + remaining + "</td>" +
                      "<td>" + points + "</td>" + 
                    "</tr>" + 
                  "</table>";                  
                  
////////////////////////////////////////////////////////
// Function ////////////////////////////////////////////
////////////////////////////////////////////////////////                  
                  
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}                  
                  
  