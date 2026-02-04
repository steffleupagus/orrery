
function drawMoon(ctx, name, x, y, r, phase)
{	
	x = Math.floor(x)
	y = Math.floor(y)
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
	if (!untangleGame.flags["Labels"]) return

	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	ctx.font = "bold 16px Arial";
	ctx.fillText(name, x, y - r);
}

function drawDisc(ctx, x, y, r)
{
	x = Math.floor(x)
	y = Math.floor(y)

	ctx.beginPath();
	ctx.arc( x, y, r, 0, 2 * Math.PI, true );
	ctx.closePath();
	ctx.fillStyle = '#660099';
	ctx.fill();
}

function drawPhase(ctx, x, y, r, phase)
{
	x = Math.floor(x)
	y = Math.floor(y)

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

	if (untangleGame.flags["Labels"])
	{
		ctx.fillStyle = "#000000";
		ctx.textAlign = "center";
		ctx.textBaseline = "center";
		ctx.font = "bold 16px Arial";
		ctx.fillText("Demiplane", cx, cy+8);
	}
	
	if (untangleGame.flags["text"])
	{
		date = formatDay()
		ctx.fillStyle = "#dddddd";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.font = "bold 16px Arial";
		ctx.fillText(`Day ${untangleGame.day}: ${date}`, cx, cy + 2 * r);		
		ctx.fillText(`Variant: ${untangleGame.currentLevel+1}`, cx, cy + 2*r - 25);
	}
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
	if (!untangleGame.flags["text"]) return;
	
	moon = untangleGame.moons[moonIndex];
	if (moon.r == 0) return;
	
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var center = {x:cx, y:cy}
	
	day = (untangleGame.day - 1) % 365
	
	parent = null
	if (moon.parent !== 'undefined') parent = untangleGame.moons[moon.parent]
	let dist = parent ? `${parent.d} ± ${moon.d}` : moon.d	
	let pass = Math.floor(day / (365 / (parent ? parent.sidereal : moon.sidereal)))
	let point = moon.path[day];
	let angle = moon.angle
	if (parent) angle = `${angle} (${moon.pAngle})`

	info = []
	info.push(`${moon.name}`)
	info.push(`• Phase Cycle: ${moon.cycle} days`)
	info.push(`• Sidereal: ${Math.mround(365 / moon.sidereal)} days`)
	if (untangleGame.flags["calculations"])
	{
		info.push(`• Orbits around: ${parent ? parent.name : "Demiplane"}`)
		info.push(`• Orbit Pass: ${pass}`)
		info.push(`• Distance: ${dist}`)
		info.push(`• Position: ${Math.mround(point.x - cx)}, ${Math.mround(point.y - cy)}`)
		info.push(`• Angle: ${angle}`)
	}
	info.push(`• ${moonData[moon.phase].name} in ${moon.sign}`)
	info.push(``)
	
	var margin = 20;
	var ch = ctx.canvas.height;
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var dx = cx + cy + margin;
	var dy = 30 + (25 * (info.length-1) * (moonIndex-1));
	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";	
	for (let i = 0; i < info.length; ++i)
	{
		ctx.font = i == 0 ? "bold 16px Arial" : "14px Arial";
		ctx.fillText(info[i], dx, dy + (23 * i));
	}
}

function drawMoonAspects(ctx)
{
	if (!untangleGame.flags["text"]) return;

	var margin = 20;
	var ch = ctx.canvas.height;
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var dx = cx + cy + margin;
	var dy = ctx.canvas.height - (untangleGame.aspects.length * 23)

	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	
	for (let i = 0; i < untangleGame.aspects.length; ++i)
	{
		ctx.font = (0 == i) ? "bold 16px Arial" : "14px Arial";
		ctx.fillText(untangleGame.aspects[i], dx, (dy + 23 * i));
	}
}

function drawMoonNotes(ctx)
{
	if (!untangleGame.flags["notes"]) return;
	
	const signs = Object.keys(untangleGame.notes);
	var dx = 20
	var dy = 20
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";

	signs.forEach(sign => {
		phases = untangleGame.notes[sign]
		ctx.fillStyle = "#00dd00";
		ctx.font = "14px Arial";	

		if (phases.length == 0)
		{
			dy += 22	
			ctx.font = "bold 18px Arial";
		}
			
		if (phases.length < 4) 
			ctx.fillStyle = "#dd0000";

		note = `${sign}: ${phases.join("|")}`
		ctx.fillText(note, dx, dy);
		dy += 18
	})
}

function drawHoroscope(ctx)
{
	if (!untangleGame.flags["horoscope"]) return;
	var dx = 20
	var dy = 40
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var margin = cx - cy - 40
	
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.fillStyle = "#dddddd";	
	ctx.font = "bold 18px Arial";
	ctx.fillText("Horoscope", dx, dy);

	dy += 22
	
	ctx.font = "14px Arial";
	wrapText(ctx, untangleGame.horoscope, dx, dy, margin, 18)
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
					var dayRange = p <= untangleGame.day
					//if (Math.abs(angle-lastAngle) >= angleInc)
					if (phaseChange && dayRange)
					{
						lastAngle = angle;
						lastPhase = phase;
						let iconSize = 12 * moon.r / defaultMoonSize
						let offsetMult = pass - (moon.sidereal / 2)
						let offset = offsetPointToCenter(start, center, offsetMult * iconSize)

						ctx.fillStyle = "#696969";
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
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
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;

	// draw moons
	var numMoons = level.moons.length;
	
	for (let moon=0; moon < numMoons; ++moon)
	{
		let {name, x, y, r, p, pathColor, parent} = untangleGame.moons[moon];
		if (r == 0) continue;
		
		drawLine(ctx, cx, cy, x, y, pathColor, pathColor, 2);
		
		if (!parent) continue;
		parent = untangleGame.moons[parent]
		let color = blendColors(pathColor, parent.pathColor)
			color = blendColors(color, "#ffffff")
			
		drawLine(ctx, parent.x, parent.y, x, y, color, color, 2);				
	}
	
	for (let moon=0; moon < numMoons; ++moon)
	{
		const {name, x, y, r, p, pathColor} = untangleGame.moons[moon];
		
		drawMoonNotes(ctx);
		drawHoroscope(ctx);
		drawMoonData(ctx, moon);

		if (r == 0) continue;

		drawMoon(ctx, name, x, y, r, p);
	}
	drawMoonAspects(ctx);

	// draw the demiplane
	drawCenter(ctx, 50);
}

function updateMoons(day, precalc=false)
{
	var ctx = untangleGame.layers[2];
	untangleGame.day = day
	ctx.setTransform(1, 0, 0, 1, 0, 0)
	
	updatePhases(day)
	updatePositions(day, ctx);
	updateZodiac(day, ctx);
	updateAspects(day, ctx);
	
	updateHoroscope(day);
}

function updatePhases(day)
{
	year = 365
	day = (day - 1) % year
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
        phaseIdx = Math.trunc( (phaseDay) / dpp )
        phaseIdx = (phaseIdx % phaseCount)
        phase = phases[phaseIdx]
		
		moon.phase = phase
		if (phase) moon.p = moonData[phase].value	//phaseValues[phase]

		untangleGame.moons[i] = moon;
	}
	
//	console.log(untangleGame.moons.map(x => x.p).join(","))
}

function updatePositions(day, ctx)
{
	var level = untangleGame.levels[untangleGame.currentLevel];	
	var numMoons = level.moons.length;
	
	var center_x = ctx.canvas.width * 0.5;
	var center_y = ctx.canvas.height * 0.5;
	var radius = defaultMoonDist;

	for (let i=0; i < numMoons; ++i)
	{
		year = 365	
		moon = untangleGame.moons[i]

		if (moon.sidereal)
			year /= moon.sidereal
		md = (day - 1) % year
		
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

function updateAspects(day, ctx)
{
	var numMoons = untangleGame.moons.length;
	untangleGame.aspects = ["Aspects"];
	
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	
	for (let i=1; i<numMoons; ++i)
	{
		let moon_a = untangleGame.moons[i];
		if (moon_a.r == 0) continue;

		for (let j=1; j<numMoons; ++j)
		{
			let moon_b = untangleGame.moons[j];
			if (moon_b.r == 0) continue;
			if (i >= j) continue;
		
			u = { x:( moon_a.x - cx), y:(moon_a.y - cy) }
			v = { x:( moon_b.x - cx), y:(moon_b.y - cy) }

			if (moon_a.parent && moon_a.parent == j)
				u = { x:( moon_a.x - moon_b.x), y:(moon_a.y - moon_b.y) }
			if (moon_b.parent && moon_b.parent == i)
				v = { x:( moon_b.x - moon_a.x), y:(moon_b.y - moon_a.y) }		
			
			let angle = Math.angle(u, v)			
			let aspect = aspects.find(a => Math.abs(angle - a.a) <= a.v)?.name || "[None]"
			
			if (untangleGame.flags["calculations"])
				aspect += ` (${Math.mround(angle)})`
			
			untangleGame.aspects.push(`${moon_a.name} ⊾ ${moon_b.name}`)
			untangleGame.aspects.push(` • ${aspect}`)
		}
	}
	
}

function updateZodiac(day, ctx)
{
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var center = {x:cx, y:cy}

	day = (day - 1) % 365

	var numMoons = untangleGame.moons.length
	for (let i=0; i < numMoons; ++i)
	{
		moon = untangleGame.moons[i]

		parent = null
		if (moon.parent !== 'undefined') parent = untangleGame.moons[moon.parent]
		
		let usePath = (moon.path.length > day && day >= 0);
		let point = usePath ? moon.path[day] : {x:moon.x, y:moon.y};
		let angle = Math.degrees(calculateAngle(point, center))
		angle = angle <= 0 ? Math.abs(angle) : 360 - angle
		angle = Math.mround(angle)
		moon.angle = angle
		
		if (parent)
		{
			pCenter = usePath ? parent.path[untangleGame.day] : {x:parent.x, y:parent.y}
			let pAngle = Math.degrees(calculateAngle(point, pCenter))
			pAngle = pAngle < 0 ? Math.abs(pAngle) : 360 - pAngle
			moon.pAngle = Math.mround(pAngle)
		}
		
		// find Zodiac
		zodiac = constellations[moon.name]
		//moon.sign = zodiac?.find(x => x.day.start <= day && x.day.end >= day)?.name
		moon.sign = zodiac?.find(x => x.angle.start <= angle && x.angle.end >= angle)?.name
	}
}

function updateHoroscope(day)
{
	untangleGame.horoscope = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat quam felis, eu ullamcorper velit scelerisque sit amet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi eu lectus id turpis imperdiet elementum. Praesent volutpat, lacus at sodales accumsan, mauris sapien sodales nisl, non molestie felis ligula non elit. Vestibulum pellentesque, nunc sed semper vulputate, enim sapien viverra elit, quis mattis turpis velit a ipsum. Curabitur sed blandit magna. Donec magna enim, feugiat nec arcu id, finibus rutrum metus. Nullam accumsan vehicula felis, id efficitur purus rutrum sit amet. Nullam scelerisque ex sed tempus dignissim. Phasellus ac dapibus purus. Quisque a gravida sapien, quis gravida mi. Nam gravida dui sed ligula imperdiet consequat. Integer dapibus vulputate dolor, sit amet scelerisque diam faucibus vitae. Mauris iaculis felis non libero sagittis malesuada.";
}