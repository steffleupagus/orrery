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

const aspects = [
	{ name: "Conjunction",	a:0,	v:8,	t:"major", desc:"This is considered the strongest blend of energies represented by the two" },
	{ name: "Opposite",		a:180,	v:8,	t:"major", desc:"Dynamic/Difficult. Energies are polarized; outer events stimulate their interaction; integration is the challenge"},
	{ name: "Trine",		a:120,	v:8,	t:"major", desc:"Harmonious alignment. Energies flow smoothly; the connection is beneficial."},
	{ name: "Square",		a:90,	v:8,	t:"major", desc:"Dynamic/Difficult. energies conflict; internal and creative tensions bring rich rewards through effort over time."},
	{ name: "Sextile",		a:60,	v:8,	t:"major", desc:"Flowing alignment. The planetary energies flow together, open into new possibilities, new connections."},
	{ name: "Trine",		a:120,	v:6,	t:"major", desc:"Harmonious alignment. Energies flow smoothly; the connection is beneficial."},

	{ name: "Quincunx",		a:150,	v:4,	t:"minor", desc:"Uneasy relationship. Energies do not flow smoothly, one or the other predominates; discrimination must be employed."},
	{ name: "Quintile",		a:72,	v:2,	t:"minor", desc:"Subtle, mystical and esoteric. Energies are positively linked and spiritual in dimension."},
	{ name: "Semisextile",	a:30,	v:2,	t:"minor", desc:"Uneasy alignment, inconjunction. Energies attract each other, require effort, allow entry of new information."},
	{ name: "Semisquare",	a:45,	v:2,	t:"minor", desc:"Minor dynamic alignment. Energies conflict in determined subtle tension; calmness is required."},
	{ name: "Sesquiquadrate",	a:135,	v:2,	t:"minor", desc:"Minor dynamic alignment. Energies conflict in determined subtle tension; control is required."},
	{ name: "Biquintile",	a:144,	v:2,	t:"minor", desc:"Minor flowing alignment. Energies are positively linked, subtle, and spiritual in dimension."},
	{ name: "Septile",		a:51.42,v:2,	t:"minor", desc:"Subtle and difficult alignment. Energies darkly interact; incline to occult dimensions apart from socially accepted norms."}	
]