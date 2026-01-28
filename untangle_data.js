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


const nul = {
			name: "[nul]",
			size: 0,
			dist:175,
			cycle: 1,
			sidereal: 1,
			dir:-1,
			phases:[""],
		}
const queen = {
			name: "Queen", 
			dist: 350,
			size: defaultMoonSize * 3,
			cycle: 90,
			sidereal: 4,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌑","🌑","🌑","🌒","🌒","🌓","🌔","🌔","🌕","🌕","🌕"],
			pathColor: "#0000FF"
		}
const minister = {
			name: "Minister", 
			size: defaultMoonSize * 2,
			//dist: 175,
			dist: defaultMoonSize * 4,
			cycle: 45,
			sidereal: 9,
			dir: -1,
			phases: ["🌕","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑","🌒","🌓","🌓","🌔"],
			pathColor: "#00ff00",
			parent: 0
		}
const advisor = {
			name: "Advisor", 
			size: defaultMoonSize,
			dist: defaultMoonSize * 8,//9,
			cycle: 28,
			sidereal: 9,
			dir: -1,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌒","🌓","🌔"],
			pathColor: "#ff0000",
			parent: 1
		}


levelsMoon = 
{
	flags: ["path"],
	offset: -88,
	moons: [nul, queen, minister, advisor]
}

///
levelsMoon1 = { ...levelsMoon, moons: [
	{...nul},
	{...queen, sidereal: 4},
	{...minister, dist: 175, parent: null },
	{...advisor, sidereal: 9 } ]
}

///
levelsMoon2 = { ...levelsMoon, moons: [
	{...nul},
	{...queen, sidereal: 3},
	{...minister, dist: defaultMoonSize * 3 },
	{...advisor, sidereal: 10 } ]
}

///
levelsMoon3 = { ...levelsMoon, moons: [
	{...nul},
	{...queen, sidereal: 2},
	{...minister, dist: defaultMoonSize * 4 },
	{...advisor, sidereal: 11 } ]
}

///
levelsMoon4 = { ...levelsMoon, moons: [
	{...nul},
	{...queen, sidereal: 1},
	{...minister, dist: defaultMoonSize * 5 },
	{...advisor, sidereal: 12 } ]
}

///
levelsMoon5 = { ...levelsMoon, moons: [
	{...nul},
	{...queen, sidereal: 3, dist: defaultMoonDist, dir: -1 },
	{...minister, sidereal: 7, dist: defaultMoonDist * 2, parent: null },
	{...advisor, sidereal: 9, dist: defaultMoonDist * 3, parent: null } ]
}

untangleGame.levels = 
[
	levelsMoon1,
	levelsMoon2,
	levelsMoon3,
	levelsMoon4,
	levelsMoon5
];
