var untangleGame = {
	domains: [],
	domainStatus: [],
	domainCoordinates: [],
	moons: [],
	
	day: 1,
	thinLineThickness: 3,
	boldLineThickness: 3,
	lines: [],
	currentLevel: (json["world"] ? json["world"] : 0),
	backgroundSrc: "http://larp.seventh-age.com/images/Dischordia.jpg",
	progressPercentage: 0,
	layers: [],
	flags: []
};

levelsMoon = 
{
	"offset": -88,
	"moons": [
		{
			name: "Queen", 
			dist: 350,
			size: defaultDomainSize * 3,
			cycle: 90,
			sidereal: 365 / 2,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌑","🌑","🌑","🌒","🌒","🌓","🌔","🌔","🌕","🌕","🌕"],
		},
		{
			name: "Minister", 
			size: defaultDomainSize * 2,
			dist: 175,
			cycle: 45,
			sidereal: 365 / 9,
			phases: ["🌕","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑","🌒","🌓","🌓","🌔"],
		},
		{
			name: "Advisor", 
			size: defaultDomainSize,
			dist: defaultDomainSize * 7,
			cycle: 28,
			sidereal: 365 / 13,
			dir: -1,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌒","🌓","🌔"],
			parent: 0
		}
	]
}

untangleGame.levels = 
[
	levelsMoon	
	// levelDischordia,
	//levelKingdoms,
];


/*


var levelDischordia = {};
{
	var subdomain = 		{	};
	var domainAppalachia = 	{	"alliedDomains"	: ["Ordo Trismegistus","Wolves of the North"],
								"enemyDomains"	: ["Empyrean Dysambigua","Imperial Bermuda"],
								"annexDomains"	: ["Appalachia","Second City"] };
	var domainOrdo = 		{ 	"alliedDomains" : ["Appalachian Alliance","Empyrean Dysambigua"],
								"enemyDomains"  : ["Imperial Bermuda","Wolves of the North","Sultanate of Glass"],
								"annexDomains"	: ["Society of Deus"] };
	var domainEmpyrean = 	{	"alliedDomains" : ["Ordo Trismegistus","Imperial Bermuda","Sultanate of Glass"],
								"enemyDomains"	: ["Wolves of the North","Appalachian Alliance"],
								"annexDomains"	: ["New Faith","Vancouver","Valley of the King","Unification"] };
	var domainSultanate =	{ 	"alliedDomains" : ["Imperial Bermuda","Empyrean Dysambigua"],
								"enemyDomains"	: ["Ordo Trismegistus","Wolves of the North"],
								"annexDomains"	: [] };
	var domainBermuda	=	{	"alliedDomains"	: ["Wolves of the North","Empyrean Dysambigua","Sultanate of Glass"],
								"enemyDomains"	: ["Ordo Trismegistus","Appalachian Alliance"],
								"annexDomains" 	: ["Aranta-Shadur","Archive","Middle Kingdom"] };
	var domainWolves = 		{	"alliedDomains" : ["Imperial Bermuda","Appalachian Alliance"],
								"enemyDomains"	: ["Empyrean Dysambigua","Ordo Trismegistus","Sultanate of Glass"],
								"annexDomains"	: ["Sept of the Black Sun"] };														
	levelDischordia = {
		"flags" : ["annex"],
		"backgroundSrc" : "http://larp.seventh-age.com/images/Dischordia.jpg",
		"domains" : {
			"Appalachian Alliance"	: domainAppalachia,
				"Appalachia" 		: subdomain,
				"Second City" 		: subdomain,				
			"Ordo Trismegistus"		: domainOrdo,
				"Society of Deus" 	: subdomain,																					
			"Empyrean Dysambigua"	: domainEmpyrean,
				"New Faith" 		: subdomain,
				"Valley of the King": subdomain,
				"Unification"		: subdomain,
				"Vancouver" 		: subdomain,
			"Sultanate of Glass"	: domainSultanate,
			"Imperial Bermuda"		: domainBermuda,
				"Aranta-Shadur" 	: subdomain,
				"Archive"			: subdomain,										
				"Middle Kingdom" 	: subdomain,	 	
			"Wolves of the North" 	: domainWolves,
				"Sept of the Black Sun" : subdomain,
		},
		"domainStatus" : {
			"Appalachian Alliance" : ["Active"], 
				"Appalachia" : ["Annexed"], 
				"Second City" : ["Annexed"], 

			"Bermuda" : ["Active"], 
				"Aranta-Shadur" : ["Annexed"], 
				"Archive" : ["Annexed"], 
				"Middle Kingdom" : ["Annexed"],
			
			"Empyrean Dysambigua" :  ["Active"], 
				"New Faith" : ["Annexed"], 				
				"Unification" : ["Annexed"], 
				"Valley of the King" : ["Annexed"], 
				"Vancouver" : ["Annexed"], 

			"Nightmare Lands":["Active"], 

			"Ordo Trismegistus":["Active"], 
				"Society of Deus" : ["Annexed"], 
				"St Louis"		  : ["Annexed"],

			"Sultanate of Glass" : ["Active"],
				
			"Wolves of the North" : ["Active"], 
				"Sept of the Black Sun" : ["Annexed"], 			
		}
	};
}

var levelKingdoms = {};
{
	var kingdomDischordia	= { 	'alliedDomains'	: ['Diamond Congo','Jade Empire','Jukurrpa'],
									'enemyDomains'	: ['Aether','Avalon','Aztlan','Vechnyy Uzhas'] };
	var kingdomAether		= { 	'alliedDomains'	: ['Iron Lotus','Stygian Alliance','Vechnyy Uzhas'],
									'enemyDomains'	: ['Dischordia','Avalon','Jukurrpa','Ukhu Amarumaya'] };
	var kingdomAvalon		= { 	'alliedDomains'	: ['German Free States','Jade Empire','Vechnyy Uzhas'],
									'enemyDomains'	: ['Dischordia','Aether','Iron Lotus','Stygian Alliance'] };
	var kingdomAztlan		= { 	'alliedDomains'	: ['Iron Lotus','Stygian Alliance','Ukhu Amarumaya'],
									'enemyDomains'	: ['Dischordia','Diamond Congo','Jade Empire','Jukurrpa'] };
	var kingdomDiamond		= { 	'alliedDomains'	: ['Dischordia','Iron Lotus','Jade Empire','Ukhu Amarumaya'],
									'enemyDomains'	: ['Aztlan','German Free States','Vechnyy Uzhas'] };
	var kingdomGerman		= { 	'alliedDomains'	: ['Avalon','Ukhu Amarumaya','Vechnyy Uzhas'],
									'enemyDomains'	: ['Diamond Congo','Iron Lotus','Jukurrpa','Stygian Alliance'] };
	var kingdomIronLotus	= { 	'alliedDomains'	: ['Aether','Aztlan','Diamond Congo','Stygian Alliance'],
									'enemyDomains'	: ['Avalon','German Free States','Jade Empire','Ukhu Amarumaya'] };
	var kingdomJade			= { 	'alliedDomains'	: ['Dischordia','Avalon','Diamond Congo','Jukurrpa'],
									'enemyDomains'	: ['Aztlan','Iron Lotus','Stygian Alliance','Vechnyy Uzhas'] };
	var kingdomJukurrpa		= { 	'alliedDomains'	: ['Dischordia','Jade Empire','Ukhu Amarumaya','Vechnyy Uzhas'],
									'enemyDomains'	: ['Aether','Aztlan','German Free States'] };
	var kingdomStygian 		= { 	'alliedDomains'	: ['Aether','Aztlan','Iron Lotus'],
									'enemyDomains'	: ['Avalon','German Free States','Jade Empire','Ukhu Amarumaya'] };
	var kingdomUkhu			= { 	'alliedDomains'	: ['Aztlan','Diamond Congo','German Free States','Jukurrpa'],
									'enemyDomains'	: ['Aether','Iron Lotus','Stygian Alliance','Vechnyy Uzhas'] };
	var kingdomVechnyy		= { 	'alliedDomains'	: ['Aether','Avalon','German Free States','Jukurrpa'],
									'enemyDomains'	: ['Dischordia','Diamond Congo','Jade Empire','Ukhu Amarumaya'] };			
	levelKingdoms = 
	{	//Default with all domains allies & enemies
		"flags" : ["hidemiscDomains"],
		"backgroundSrc" : "http://larp.seventh-age.com/images/World.png",
		"domains" : {
			"Dischordia"			: kingdomDischordia,
			"Aether"			    : kingdomAether,	
			"Avalon"			    : kingdomAvalon,
			"Aztlan"			    : kingdomAztlan,
			"Diamond Congo"		    : kingdomDiamond,
			"German Free States"	: kingdomGerman,
			"Iron Lotus"		    : kingdomIronLotus,
			"Jade Empire"		    : kingdomJade,
			"Jukurrpa"			    : kingdomJukurrpa,
			"Stygian Alliance"	    : kingdomStygian,
			"Ukhu Amarumaya"	    : kingdomUkhu,
			"Vechnyy Uzhas"		    : kingdomVechnyy
		},
		"domainStatus" : {
			"Dischordia"			:["Active"],
			"Aether"			    :["Active"],
			"Avalon"			    :["Active"],
			"Aztlan"			    :["Active"],
			"Diamond Congo"		    :["Active"],
			"German Free States"	:["Active"],
			"Iron Lotus"		    :["Active"],
			"Jade Empire"		    :["Active"],
			"Jukurrpa"			    :["Active"],
			"Stygian Alliance"	    :["Active"],
			"Ukhu Amarumaya"	    :["Active"],
			"Vechnyy Uzhas"		    :["Active"]
		},		
	};
}

*/