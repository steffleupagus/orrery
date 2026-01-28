var untangleGame = {
	domains: [],
	domainStatus: [],
	domainCoordinates: [],
	moons: [],
	
	day: 1,
	thinLineThickness: 3,
	boldLineThickness: 3,
	lines: [],
	currentLevel: json["world"] ?? 0,
	backgroundSrc: "Zodiac_Shifted.png",
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
			size: defaultMoonSize * 3,
			cycle: 90,
			sidereal: 4,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌑","🌑","🌑","🌒","🌒","🌓","🌔","🌔","🌕","🌕","🌕"],
			pathColor: "#0000FF"
		},
		{
			name: "",
			size: 0,
			dist:175,
			cycle: 1,
			sidereal: 1,
			dir:-1,
			phases:[""],
		},
		{
			name: "Minister", 
			size: defaultMoonSize * 2,
			//dist: 175,
			dist: defaultMoonSize * 3,
			cycle: 45,
			//sidereal: 9,
			sidereal: 9,
			dir: -1,
			phases: ["🌕","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑","🌒","🌓","🌓","🌔"],
			pathColor: "#00ff00",
			parent: 1
		},
		{
			name: "Advisor", 
			size: defaultMoonSize,
			dist: defaultMoonSize * 9,
			cycle: 28,
//			sidereal: 10,
			sidereal: 9,
			dir: -1,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌒","🌓","🌔"],
			pathColor: "#ff0000",
			parent: 0
		}
	]
}

untangleGame.levels = 
[
	levelsMoon
];
