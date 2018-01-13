// scrapeData.js
// Write an html page taken from hockeymanager

var webPage = require('webpage');

var page = webPage.create();

var fs = require('fs');

var path = 'data/data.html';

page.open('http://hockeymanager.ch/playerPerfomancePage', function (status) {
  
   var content = page.content;
 
   fs.write(path,content,'w');
  
   phantom.exit();

});