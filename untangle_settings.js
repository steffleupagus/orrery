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


const queenZodiac = [
	{ name: "Key", day:{ start:1, end:32 }, angle:{ start:0, end:31 } },
	{ name: "Crown", day:{ start:33, end:123 }, angle:{ start:31, end:121 } },
	{ name: "Chain", day:{ start:124, end:214 }, angle:{ start:121, end:211 } },
	{ name: "Candle", day:{ start:215, end:305 }, angle:{ start:211, end:301 } },
	{ name: "Key", day:{ start:306, end:365 }, angle:{ start:301, end:360 } }
]
const ministerZodiac = [
	{ name: "Leaf", day:{ start:1, end:23 }, angle:{ start:0, end:22 } },
	{ name: "Chalice", day:{ start:24, end:68 }, angle:{ start:22, end:67 } },
	{ name: "Fan", day:{ start:69, end:114 }, angle:{ start:67, end:112 } },
	{ name: "Rose", day:{ start:115, end:159 }, angle:{ start:112, end:157 } },
	{ name: "Coins", day:{ start:160, end:205 }, angle:{ start:157, end:202 } },
	{ name: "Mask", day:{ start:206, end:250 }, angle:{ start:202, end:247 } },
	{ name: "Sword", day:{ start:251, end:296 }, angle:{ start:247, end:292 } },
	{ name: "Tome", day:{ start:297, end:341 }, angle:{ start:292, end:337 } },
	{ name: "Leaf", day:{ start:342, end:365 }, angle:{ start:337, end:360 } }
]
const advisorZodiac = [
	{ name: "Rabbit", day:{ start:1, end:18 }, angle:{ start:0, end:18 } },
	{ name: "Minotaur", day:{ start:19, end:46 }, angle:{ start:18, end:45 } },
	{ name: "Unicorn", day:{ start:47, end:74 }, angle:{ start:45, end:73 } },
	{ name: "Dragon", day:{ start:75, end:102 }, angle:{ start:73, end:101 } },
	{ name: "Butterfly", day:{ start:103, end:130 }, angle:{ start:101, end:128 } },
	{ name: "Succubus", day:{ start:131, end:158 }, angle:{ start:128, end:156 } },
	{ name: "Illithid", day:{ start:159, end:186 }, angle:{ start:156, end:183 } },
	{ name: "Drider", day:{ start:187, end:214 }, angle:{ start:183, end:211 } },
	{ name: "Mimic", day:{ start:215, end:242 }, angle:{ start:211, end:239 } },
	{ name: "Stag", day:{ start:243, end:270 }, angle:{ start:239, end:266 } },
	{ name: "Deep", day:{ start:271, end:298 }, angle:{ start:266, end:294 } },
	{ name: "Centaur", day:{ start:299, end:326 }, angle:{ start:294, end:322 } },
	{ name: "Wolf", day:{ start:327, end:354 }, angle:{ start:322, end:349 } },
	{ name: "Rabbit", day:{ start:355, end:365 }, angle:{ start:349, end:360 } }
]
const constellations = { Queen:queenZodiac, Minister:ministerZodiac, Advisor:advisorZodiac }