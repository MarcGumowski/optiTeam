#######################################################################
#                              optiTeam                               #
#                              Marc Gumowski                          # 
#######################################################################
#                                                                     #
# Scrape data from HTML file created by phantomJS.                    #
# Store data as time series in RData format.                          #
# Create data to optimize in javascript format.                       #
#                                                                     #
#######################################################################

rm(list=ls())

# Install packages
list.of.packages <- c("data.table", "jsonlite", "rvest")
new.packages     <- list.of.packages[!(list.of.packages %in% installed.packages()[ ,"Package"])]
if(length(new.packages)) {
  install.packages(new.packages)
}

# Load packages
invisible(lapply(list.of.packages, library, character.only = TRUE))

# Functions -----------------------------------------------------------
capFirst <- function(s) {
  paste0(toupper(substring(s, 1, 1)), substring(s, 2))
}

# Get Data ------------------------------------------------------------

# PhantomJS scrape hockeymanager, output is written to playerPrice.html
system("js/phantomjs/bin/phantomjs data/scrapeData.js")

# Scrape Data
url          <- read_html("data/data.html")
selectorName <- "div.tab-pane.active .playerName, 
div.tab-pane.active .teamName,
div.tab-pane.active td:nth-child(4),
div.tab-pane.active td:nth-child(5),
div.tab-pane.active td:nth-child(10),
div.tab-pane.active td:nth-child(11)"
nodes        <- html_nodes(x = url, css = selectorName)
playerStats  <-   html_text(nodes)

# Scrape Nationality by img
selectorNameNat  <- "div.tab-pane.active td:nth-child(4) , td~ td+ td img"
nodesNat         <- html_nodes(x = url, css = selectorNameNat)
playerStatsNat   <- html_attr(nodesNat, "src")
playerStatsNat   <- as.numeric(ifelse(is.na(playerStatsNat),0,1))
playerStatsNat   <- playerStatsNat[-(which(playerStatsNat == 1)-1)] # Remove blanks

# Clean Data 
playerStats           <- data.frame(matrix(playerStats, ncol = 6, byrow = T))
colnames(playerStats) <- c("team", "player", "nat", "pos", "points", "budget")
playerStats           <- playerStats[c("player","team", "nat", "pos", "points", "budget")]
playerStats$nat       <- playerStatsNat
playerStats$points    <- as.numeric(do.call('rbind', 
                                            strsplit(as.character(playerStats$points),'(',fixed=TRUE))[ ,1])
playerStats$budget    <- as.numeric(do.call('rbind', 
                                            strsplit(as.character(playerStats$budget),'M',fixed=TRUE)))
# Remove accent
unwantedArray <- list('Š'='S', 'š'='s', 'Ž'='Z', 'ž'='z', 'À'='A', 'Á'='A', 'Â'='A', 'Ã'='A', 'Ä'='A', 'Å'='A', 
                     'Æ'='A', 'Ç'='C', 'È'='E', 'É'='E', 'Ê'='E', 'Ë'='E', 'Ì'='I', 'Í'='I', 'Î'='I', 'Ï'='I', 
                     'Ñ'='N', 'Ò'='O', 'Ó'='O', 'Ô'='O', 'Õ'='O', 'Ö'='O', 'Ø'='O', 'Ù'='U', 'Ú'='U', 'Û'='U', 
                     'Ü'='U', 'Ý'='Y', 'Þ'='B', 'ß'='Ss', 'à'='a', 'á'='a', 'â'='a', 'ã'='a', 'ä'='a', 'å'='a', 
                     'æ'='a', 'ç'='c', 'è'='e', 'é'='e', 'ê'='e', 'ë'='e', 'ì'='i', 'í'='i', 'î'='i', 'ï'='i', 
                     'ð'='o', 'ñ'='n', 'ò'='o', 'ó'='o', 'ô'='o', 'õ'='o', 'ö'='o', 'ø'='o', 'ù'='u', 'ú'='u',
                     'ü'='u', 'û'='u', 'ý'='y', 'ý'='y', 'þ'='b', 'ÿ'='y' )
playerStats$player    <- chartr(paste(names(unwantedArray), collapse=''),
                                paste(unwantedArray, collapse=''),
                                playerStats$player)
playerStats$team      <- capFirst(tolower(chartr(paste(names(unwantedArray), collapse=''),
                              paste(unwantedArray, collapse=''),
                              playerStats$team)))

# Position dummies
playerStats$offense   <- ifelse(playerStats$pos=="F", 1, 0)
playerStats$defense   <- ifelse(playerStats$pos=="D", 1, 0)
playerStats$goalie    <- ifelse(playerStats$pos=="G", 1, 0)

# Save data 
load("data/ts/playerStats.RData")
playerStatsDate <- cbind(date = Sys.Date(), playerStats)
save(playerStatsDate, 
     file = paste0("data/ts/playerStat_", format(Sys.Date(), "%d_%m_%Y"), ".RData"))
playerStatsAllDate <- unique(rbind(playerStatsAllDate, playerStatsDate))
save(playerStatsAllDate, file = "data/ts/playerStats.RData")

# Convert to JSON ------------------------------------------------------------

# playerStats as list with player as list name
playerStats <- setNames(split(playerStats, seq(nrow(playerStats))), as.character(playerStats[ ,1]))
# Add unique id
for (i in 1:length(playerStats)) {
  playerStats[[i]][[paste0("id", i)]] <- 1
}

# Write toJSON -> js file
data <- toJSON(playerStats, pretty = T, auto_unbox = F, dataframe = "columns")

# Prepare JS file ------------------------------------------------------------

# Remove square brackets
data <- gsub("\\[|]", "", data)

# Create JS file for the model to work. See Linear Programming Solver library on https://github.com/JWally/jsLPSolver/
# Store the data in javascript
write(paste0('var model = {
 "optimize": "points",
 "opType": "max",
 "constraints": {
  "nat": {"max": 4},
  "offense": {"equal": 12},
  "defense": {"equal": 8},
  "goalie": {"equal": 2},
  "budget": {"max": 165.5},',
  paste0('"id', 1:length(playerStats), '": {"max": 1}, \n', sep = "", collapse = ""),           
 '},
 "variables": ', data, 
 ', \n"ints": {', 
 paste0('"', names(playerStats), '": 1,', sep = "", collapse = ""),
 '} \n };'), 'data/data.js')



