
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

	// prepare the radial gradients fill style
	const moon = untangleGame.moons[1]

	var gradient = ctx.createRadialGradient(cx-r/2,cy-r/3,1,cx,cy,r);
		
	gradient.addColorStop(0, "#FF00FF");
	gradient.addColorStop(1, "#660099");
	ctx.fillStyle = gradient;

	ctx.beginPath();
	ctx.arc(cx, cy, r, 0, Math.PI*2, true );
	ctx.closePath();
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
	ctx.fillText(`Day ${untangleGame.day}: ${date}`, cx, cy + 2 * r);		
	ctx.fillText(`Variant: ${untangleGame.currentLevel+1}`, cx, cy + 2*r - 25);
	
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

function drawMoonData(ctx, moonIndex)
{
	moon = untangleGame.moons[moonIndex];
	if (moon.r == 0) return;
	
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var center = {x:cx, y:cy}
	
	parent = null
	if (moon.parent !== 'undefined') parent = untangleGame.moons[moon.parent]
	let dist = parent ? `${parent.d} ± ${moon.d}` : moon.d	
	let pass = Math.floor(untangleGame.day / (365 / moon.sidereal))
	let point = moon.path[untangleGame.day-1];
	let angle = Math.degrees(calculateAngle(point, center))
	angle = angle <= 0 ? Math.abs(angle) : 360 - angle
	angle = Math.mround(angle)
	if (parent)
	{
		pCenter = parent ? parent.path[untangleGame.day-1] : center	
		let pAngle = Math.degrees(calculateAngle(point, pCenter))
		pAngle = pAngle < 0 ? Math.abs(pAngle) : 360 - pAngle
		pAngle = Math.mround(pAngle)
		angle = `${angle} (${pAngle})`
	}


	info = []
	info.push(`${moon.name}`)
	info.push(`Phase Cycle: ${moon.cycle} days`)
	info.push(`Sidereal: ${moon.sidereal} complete orbits`)
	info.push(`Orbits around: ${parent ? parent.name : "Demiplane"}`)
	info.push(`Distance: ${dist}`)
	info.push(`Orbit Pass: ${pass}`)
	info.push(`Angle: ${angle}`)
	info.push(`Position: ${Math.mround(point.x - cx)}, ${Math.mround(point.y - cy)}`)
	
	var margin = 20;
	var ch = ctx.canvas.height;
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var dx = cx + cy + margin;
	var dy = 50 + (30 * info.length * (moonIndex-1));
	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.font = "bold 16px Arial";	
	for (let i = 0; i < info.length; ++i)
		ctx.fillText(info[i], dx, dy + (23 * i));
}


function DrawMoonPath(ctx)
{
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	center = {x:cx, y:cy}
	const angleInc = Math.radians( 15 );

	for(var i=0; i < untangleGame.moons.length;++i)
	{
		let moon = untangleGame.moons[i];
		let pointCount = moon.path.length;
		let thick = moon.r / defaultMoonSize;
		let color = moon.pathColor;

		if (moon.r == 0 || !color) continue;

		let lastPhase = null;
		let lastAngle = null;
		let currPass = Math.floor(untangleGame.day / (365 / moon.sidereal))
		for (var p = 0; p < pointCount; ++p)
		{
			let pass = Math.floor(p / (365 / moon.sidereal))

			var start = moon.path[p];
			var end = moon.path[(p+1)%pointCount];
			var rx = 0;
			var ry = 0;
			if (start && end && start != end)
			{
				var x = end.x - start.x;
				var y = end.y - start.y;
				var v = new Point(x,y);
				v = normal(v);
				nx = v.x;
				ny = v.y;				
				//Rotate the vector
				theta = Math.radians(0);
				cs = Math.cos(theta);
				sn = Math.sin(theta);
				rx = nx * cs - ny * sn; 
				ry = nx * sn + ny * cs;
				//Scale it
				rx = rx * 0//linkOffsets[type];
				ry = ry * 0//linkOffsets[type];				
				
				var avoidPoints = [];

				drawLine(ctx, start.x + rx, 
							  start.y + ry, 
							  end.x + rx, 
							  end.y + ry, 
							  color, 
							  color, 
							  thick);

				if (untangleGame.flags["phaseIcons"+moon.name.toLowerCase()])
				{
					var phase = moon.path[p].p
					var phaseChange = phase != lastPhase
					var samePass = currPass == pass
					var angle = calculateAngle(start, center)
					if (Math.abs(angle-lastAngle) >= angleInc)
					{
						lastAngle = angle;
						lastPhase = phase;
						let iconSize = 12 * moon.r / defaultMoonSize
						let offsetMult = pass - (moon.sidereal / 2)
						let offset = offsetPointToCenter(start, center, offsetMult * iconSize)

						ctx.fillStyle = "#696969";
						ctx.textAlign = "center";
						ctx.textBaseline = "center";
						ctx.font = `bold ${iconSize}px Arial`;					
						ctx.fillText(phase, offset.x, offset.y);
					}
				}
			}
		}
	}
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
		
		drawMoonData(ctx, moon);

		if (r == 0) continue;

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
