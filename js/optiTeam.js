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
model.constraints.budget = {"max": budget};

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


// Remaining

// Foreign players

// Goalies

// Defense

// Offense

////////////////////////////////////////////////////////
// Print results ///////////////////////////////////////
////////////////////////////////////////////////////////

var goalies = document.getElementById("goalies");
goalies.innerHTML = "<h2>Goalies</h2>" + 
                  "<table>" + 
                    "<tr>" + 
                      "<th>" + "Player" + "</th>" +
                      "<th>" + "Foreigner" + "</th>" +
                      "<th>" + "Points" + "</th>" +
                      "<th>" + "Price" + "</th>" +
                    "</tr>" + 
                  "</table>";
                  
var defense = document.getElementById("defense");
defense.innerHTML = "<h2>Defense</h2>" + 
                  "<table>" + 
                    "<tr>" + 
                      "<th>" + "Player" + "</th>" +
                      "<th>" + "Foreigner" + "</th>" +
                      "<th>" + "Points" + "</th>" +
                      "<th>" + "Price" + "</th>" +
                    "</tr>" + 
                  "</table>";
                  
var offense = document.getElementById("offense");
offense.innerHTML = "<h2>Offense</h2>" + 
                  "<table>" + 
                    "<tr>" + 
                      "<th>" + "Player" + "</th>" +
                      "<th>" + "Foreigner" + "</th>" +
                      "<th>" + "Points" + "</th>" +
                      "<th>" + "Price" + "</th>" +
                    "</tr>" + 
                  "</table>";
                  
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
                      "<td>" + "" + "</td>" +
                      "<td>" + budget + "</td>" +
                      "<td>" + "" + "</td>" +
                      "<td>" + "" + "</td>" +
                      "<td>" + points + "</td>" + 
                    "</tr>" + 
                  "</table>";                  
                  
                  
                  
                  
                  
                  
  