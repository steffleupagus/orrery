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
	backgroundSrc: "http://larp.seventh-age.com/images/Dischordia.jpg",
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
			sidereal: 3,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌑","🌑","🌑","🌒","🌒","🌓","🌔","🌔","🌕","🌕","🌕"],
		},
		{
			name: "Minister", 
			size: defaultDomainSize * 2,
			dist: 175,
			cycle: 45,
			sidereal: 9,
			dir: -1,
			phases: ["🌕","🌕","🌖","🌗","🌗","🌘","🌑","🌑","🌑","🌒","🌓","🌓","🌔"],
		},
		{
			name: "Advisor", 
			size: defaultDomainSize,
			dist: defaultDomainSize * 9,
			cycle: 28,
			sidereal: 13,
			dir: -1,
			phases: ["🌕","🌖","🌖","🌗","🌘","🌘","🌑","🌒","🌓","🌔"],
			parent: 0
		}
	]
}

untangleGame.levels = 
[
	levelsMoon
];
