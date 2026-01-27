
function drawMoon(ctx, name, x, y, r, phase)
{
	ctx.save(); // Save default state
	if ( phase <= 0.5 ) {
		drawDisc(ctx, x, y, r);
		drawPhase(ctx, x, y, r, 4 * phase - 1 );
	} else {
		ctx.translate( x, y );
		ctx.rotate( Math.PI );
		ctx.translate( -x, -y );

		drawDisc(ctx, x, y, r);
		drawPhase(ctx, x, y, r, 4 * ( 1 - phase ) - 1 );
	}
	ctx.restore()
	
	drawLabel(ctx, name, x, y, r)
}

function drawLabel(ctx, name, x, y, r)
{
	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "bold 16px Arial";
	ctx.fillText(name, x, y - r);	
}

function drawDisc(ctx, x, y, r)
{
	ctx.beginPath();
	ctx.arc( x, y, r, 0, 2 * Math.PI, true );
	ctx.closePath();
	ctx.fillStyle = '#660099';
	ctx.fill();
}

function drawPhase(ctx, x, y, r, phase)
{
	ctx.beginPath();
	ctx.arc( x, y, r, -Math.PI/2, Math.PI/2, true );
	ctx.closePath();
	ctx.fillStyle = '#fff';
	ctx.fill();

	ctx.translate( x, y );
	ctx.scale( phase, 1 );
	ctx.translate( -x, -y );
	ctx.beginPath();
	ctx.arc( x, y, r, -Math.PI/2, Math.PI/2, true );
	ctx.closePath();
	ctx.fillStyle = phase > 0 ? '#660099' : '#fff';
	ctx.fill();
}

function drawCenter(ctx, r)
{
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;

	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI*2, true );
	ctx.closePath();
	ctx.fillStyle = '#FF00FF';
	ctx.fill();
	ctx.fillStyle = "#000000";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.font = "bold 16px Arial";
	ctx.fillText("Demiplane", cx, cy+8);
	
	date = formatDay()
	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "bold 16px Arial";
	ctx.fillText(`Day: ${date}`, cx, cy + 2 * r);		
	
}

function formatDay () {
    // Start with the first day of the year (January 1st, month index 0, day 1)
    // The time is set to midnight local time.
    const date = new Date(2025, 0, 1);
	
    // Add the number of days to the date.
    // Since setDate adds to the *current* day (which is day 1), we add dayOfYear - 1.
	
	var level = untangleGame.levels[untangleGame.currentLevel];	
	dayOfYear = untangleGame.day - level.offset	
    date.setDate(date.getDate() + dayOfYear - 1);

	const options = {
		month: 'short', // "Nov"
		day: 'numeric'  // "24"
	};

	// Create a formatter for a specific locale (e.g., U.S. English)
	const formatter = new Intl.DateTimeFormat('en-US', options);
	const formattedDate = formatter.format(date);

    return formattedDate
}

function DrawMoons(ctx, level)
{
	// draw the demiplane
	drawCenter(ctx, 50);
	
	// draw moons
	var numMoons = level.moons.length;
	for (let moon=0; moon < numMoons; ++moon)
	{
		const {name, x, y, r, p} = untangleGame.moons[moon];
		drawMoon(ctx, name, x, y, r, p);
	}
}

function updateMoons(day)
{
	untangleGame.day = day
	updatePhases(day)
	updatePositions(day);
}

const phaseValues = {
	"🌕":0,
	"🌖":0.125,
	"🌗":0.25,
	"🌘":0.375,
	"🌑":0.5,
	"🌒":0.625,
	"🌓":0.75,
	"🌔":0.875
}

function updatePhases(day)
{
	year = 365
	day = day % year
	var level = untangleGame.levels[untangleGame.currentLevel];	
	var numMoons = level.moons.length;
	for (let i=0; i < numMoons; ++i)
	{		
		moon = untangleGame.moons[i]
        cycle = moon.cycle
        phases = moon.phases		
        phaseCount = phases.length
        monthCount = Math.floor(365 / cycle)
        cycleOffset = moon.offset || 0
        dpp = cycle / phaseCount
        feyDays = year % cycle
        annualOffset = feyDays % 2
        season = (feyDays > 1) ? Math.floor((year-annualOffset) / (feyDays - annualOffset * 1)) : 0
		        
        dOff = day - annualOffset
        isFeyTithe = annualOffset ? (dOff % year) == 0 : false
        isSeason = season ? (dOff % season) == 1 : false
        isSpecial = isFeyTithe || isSeason
        seasonOffset = season ? Math.floor((day - 2) / season) + 1 : 0
        
        D = isSpecial ? 0 : dOff-seasonOffset
        monthDay = isSpecial ? 1 : (((D - 1) % cycle) + 1)
        phaseDay = ((monthDay + cycleOffset - 1) % cycle) + 1
        phaseIdx = Math.trunc( Math.floor(phaseDay - 1) / dpp ) + 1
        phaseIdx = ((phaseIdx - 1) % phaseCount)
        phase = phases[phaseIdx]
		
		moon.phase = phase
		moon.p = phaseValues[phase]

		untangleGame.moons[i] = moon;
	}
	
//	console.log(untangleGame.moons.map(x => x.p).join(","))
}

function updatePositions(day)
{
	var level = untangleGame.levels[untangleGame.currentLevel];	
	var numMoons = level.moons.length;
	
	var ctx = untangleGame.layers[0];
	var center_x = ctx.canvas.width * 0.5;
	var center_y = ctx.canvas.height * 0.5;
	var radius = defaultMoonDist;

	for (let i=0; i < numMoons; ++i)
	{
		year = 365	
		moon = untangleGame.moons[i]

		if (moon.sidereal)
			year /= moon.sidereal
		md = (day - 1) % year;
		
		var angle = Math.radians(md / year * 360) * -moon.dir
		
		mp = (moon.parent !== undefined) ? untangleGame.moons[moon.parent] : false;
		cx = mp?.x ?? center_x
		cy = mp?.y ?? center_y

		radius = moon.d
		moon.x = radius * Math.cos(angle) + cx;
		moon.y = radius * Math.sin(angle) + cy;
		untangleGame.moons[i] = moon;
	}
}
