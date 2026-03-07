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
			cycle: 1,
			phases:[""],

			sidereal: 3,
			dir:-1,
			dist:175,
		}
const queen = {
			name: "Queen", 
			size: defaultMoonSize * 3,
			cycle: 90,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌑","🌑","🌑","🌒","🌒","🌓","🌔","🌔","🌕","🌕","🌕"],
			faces: ["Whore","Mother","Mistress","Whore","Mother","Mistress"],
			pathColor: "#0000FF",
			sidereal: 3,
			dir: 1, 
			dist: 350,
		}
const minister = {
			name: "Minister", 
			size: defaultMoonSize * 2,
			cycle: 45,
			phases: ["🌕","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑","🌒","🌓","🌓","🌔"],
			faces: ["Herald","Steward","Consort","Mediator","Sage","Judge","Chamberlain"],
			pathColor: "#00ff00",

			sidereal: 5,
			dir: 1,
			dist: defaultMoonSize * 3,
			parent: 0
		}
const advisor = {
			name: "Advisor", 
			size: defaultMoonSize,
			cycle: 28,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌒","🌓","🌔"],
			faces: ["Servant","Brat","Pet","Bound","Sycophant","Fool"],
			pathColor: "#ff0000",

			sidereal: 10,
			dir: -1,
			dist: defaultMoonSize * 9,
			parent: 1
		}
const sun = {
			name: "Bound Sun",
			size: 1,
			cycle: 1,
			phases:["☀️"],
			pathColor: "#FFFF00",

			sidereal: 1,
			dir:1,
			dist:670,
			isSun: true
}

levelsMoon = 
{
	flags: ["background","path","text"],
	offset: -88,
	moons: [nul, queen, minister, advisor, sun]
}

sync = { sidereal: 1, dir: 1, parent: null }


const levels = []

///
levels.push({ ...levelsMoon, moons: [
				{...nul},// sidereal:-5, dist: 150},// ...sync, dist: defaultMoonDist * 0},
				{...queen},// ...sync, dist: defaultMoonDist * 1},
				{...minister},// sidereal: 3, dir: -1, dist: 50},// ...sync, dist: defaultMoonDist * 2},
				{...advisor},//, ...sync, dist: defaultMoonDist *3}
				//{...sun}
			]})

///
levels.push({ ...levelsMoon, moons: [
				{...nul, sidereal:7, dist:25},// sidereal:-5, dist: 150},// ...sync, dist: defaultMoonDist * 0},
				{...queen},// ...sync, dist: defaultMoonDist * 1},
				{...minister, sidereal: 1, dir: 1, dist: defaultMoonDist + defaultMoonSize * 3 },// ...sync, dist: defaultMoonDist * 2},
				{...advisor}//, ...sync, dist: defaultMoonDist *3}
			]})


///
levels.push({ ...levelsMoon, moons: [
				{...nul,		sidereal: 1},
				{...queen},
				{...minister, 	sidereal: 9, dir: -1, dist: defaultMoonSize * 3, parent:0},
				{...advisor, 	dist: defaultMoonSize * 8} ]
			})

///
levels.push({ ...levelsMoon, moons: [
				{...nul,		sidereal: 7},
				{...queen},
				{...minister, 	sidereal: 8, parent:0, dist: defaultMoonSize * 5, dir: 1},
				{...advisor} ]
			})

///
levels.push({ ...levelsMoon, moons: [
				{...nul,		sidereal: 1},
				{...queen},
				{...minister, 	sidereal: 7, parent:0, dist: defaultMoonSize * 5, dir: 1},
				{...advisor} ]
			})

///
levels.push({ ...levelsMoon, moons: [
				{...nul,		sidereal: 1},
				{...queen},
				{...minister, 	sidereal: 7, parent:null, dist: 175},
				{...advisor} ]
			})

///
levels.push({ ...levelsMoon, moons: [
				{...nul},
				{...queen, 		sidereal: 1},
				{...minister,	dist: defaultMoonSize * 5 },
				{...advisor,	sidereal: 12 } ]
			})

///
levels.push({ ...levelsMoon, moons: [
				{...nul},
				{...queen,		sidereal: 3, dist: defaultMoonDist, 	dir: -1 },
				{...minister, 	sidereal: 7, dist: defaultMoonDist * 2, parent: null },
				{...advisor, 	sidereal: 9, dist: defaultMoonDist * 3, parent: null } ]
			})

untangleGame.levels = levels
