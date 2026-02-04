var json = getJsonFromUrl();

var defaultRadius = 300;
var defaultDomainSize = 10;
var defaultMoonSize = 10;
var defaultMoonDist = 150;
var avoidRadius = getParameterByName("avoidRadius");
if (0 == avoidRadius)
	avoidRadius = defaultDomainSize * 2;
if (getParameterByName("map") || getParameterByName("Map"))
	untangleGame.flags["Map"] = true;
		
var statusColors = {
				"NPC" :  ["#fff","#000"],
				"Test" :  ["#fff","#0cc"],
				"Active" : ["#fff","#ff0"],
				"Annexed" : ["#fff","#990"],
				"Destroyed" : ["#f00","#000"],
			};
			
var linkOffsets = {
				"alliedDomains" : 1.33,
				"enemyDomains"	: -1.33,
				"spiedDomains"	: 4,
				"miscDomains"	: -4,
				"annexDomains"  : 0
			};
			 
var linkColors = {
				"alliedDomains" : ["#090","#0f0"],
				"enemyDomains"	: ["#900","#f00"],
				"spiedDomains"	: ["#333","#999"],
				"miscDomains"	: ["#099","#0ff"],
				"annexDomains"	: [statusColors["Active"][1], statusColors["Annexed"][1]]
			};			
			 
var colorBlind = getParameterByName("colorBlind");
if (colorBlind)
{
	linkColors = {
				"alliedDomains" : ["#cfff04","#cfff04"],
				"enemyDomains"	: ["#E87600","#E87600"],
				"spiedDomains"	: ["#999","#999"],
				"miscDomains"	: ["#fff","#fff"],
				"annexDomains"	: statusColors["Annexed"]
			};
}

const moonData = {
	"🌕":{ value: 0, 	name: "Full" },
	"🌖":{ value:0.125,	name: "Waning" },
	"🌗":{ value:0.25,	name: "Waning" },
	"🌘":{ value:0.375,	name: "Waning" },
	"🌑":{ value:0.5,	name: "New" },
	"🌒":{ value:0.625,	name: "Waxing" },
	"🌓":{ value:0.75,	name: "Waxing" },
	"🌔":{ value:0.875,	name: "Waxing" }
}
