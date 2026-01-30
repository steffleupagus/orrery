

function setupDefaultFlags()
{
	untangleGame.flags["Labels"] = true;
	var level = untangleGame.levels[untangleGame.currentLevel];
	for (var i=0; i < level.flags?.length; ++i)
	{
		var flag = level.flags[i];
		untangleGame.flags[flag] = true;
	}
}

function setupCurrentLevel() 
{	
	setupDefaultFlags();
			
	untangleGame.domains = [];
	untangleGame.moons = [];

	var level = untangleGame.levels[untangleGame.currentLevel];	
	untangleGame.backgroundSrc = level.backgroundSrc ?? untangleGame.backgroundSrc;
	var ctx = untangleGame.layers[0];
	var center_x = ctx.canvas.width * 0.5;
	var center_y = ctx.canvas.height * 0.5;
	
	if (level.moons)
	{
		for (let i=0; i < level.moons.length; ++i)
		{
			moon = level.moons[i];
			moon.dist = moon.dist ?? defaultMoonDist * (3 - i)			
			moon.path = []
			untangleGame.moons.push(new Moon(moon))
		}
		
		
		for (let d=0; d<365; ++d)
		{
			updateMoons(d+1, true)
			for (let i=0; i < untangleGame.moons.length; ++i)
			{				
				let moon = untangleGame.moons[i];
				moon.path.push({x:moon.x, y:moon.y, p:moon.phase, s:moon.sign});
			}
		}
		const signs = {}
		for (let i=0; i < untangleGame.moons.length; ++i)
		{
			let moon = untangleGame.moons[i];
			if (moon.r == 0) continue;

			signs[moon.name] = []
			moon.path.forEach(path => {				
				signs[path.s] = signs[path.s] ?? []
				phase = moonData[path.p].name				
				if (!signs[path.s].includes(phase))
					signs[path.s] = [...signs[path.s], phase]
				signs[path.s].sort()
			})
		}
		untangleGame.notes = signs
		
		updateMoons(untangleGame.day);		
	}
	
	if (level.domains)
	{
		for (var key in level.domains) 
		{
			untangleGame.domains[key] = new Domain(key, center_x, center_y, defaultDomainSize);
		}	
		connectDomains();	
		arrangeDomains();
	}
}

function startAutoUpdate()
{
	clearTimeout(untangleGame.autoStart);
	clearInterval(untangleGame.autoUpdate);
	untangleGame.autoStart = null;
	untangleGame.autoUpdate = setInterval(autoUpdate, 100);
}

function autoUpdate()
{
	day = (untangleGame.day + 1) % 365
	$("#slider").slider('value',day);
	updateDay(day);
}

function pauseAutoUpdate(seconds = 10)
{
	clearTimeout(untangleGame.autoStart);
	untangleGame.autoStart = null;

	if (untangleGame.autoUpdate)
	{
		untangleGame.autoStart = setTimeout(() => {
			startAutoUpdate();
		}, seconds*1000);	
	}
	
	clearInterval(untangleGame.autoUpdate);
	untangleGame.autoUpdate = null;
}

function updateDay(day)
{
	untangleGame.day = day
	updateMoons(untangleGame.day);
}

function gameloop() 
{	
	drawLayerBG();
	drawLayerUI();
	drawLayerGame();	
}

// draw graphics that related to the bg canvas
function drawLayerBG()
{	
	var ctx = untangleGame.layers[0];
	clear(ctx);

	if (!untangleGame.flags["background"]) return;
	
	var ch = ctx.canvas.height
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var dx = cx - cy;
	var dy = 0
	
	ctx.drawImage(untangleGame.background, dx, dy, ch, ch);
}

function drawLayerUI()
{
	var ctx = untangleGame.layers[1];
	clear(ctx);

	if (!untangleGame.flags["text"]) return;

	const helpText = [
		"[p] Show / Hide Paths",
		"[n] Cycle next orbit variant",
		"[space] pause/resume"
	]

	var margin = 20;
	var ch = ctx.canvas.height;
	var cx = ctx.canvas.width * 0.5;
	var cy = ctx.canvas.height * 0.5;
	var dx = cx + cy + margin;
	var dy = ctx.canvas.height - (helpText.length * 40);
	
	ctx.fillStyle = "#dddddd";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.font = "bold 16px Arial";
	
	for (let i = 0; i < helpText.length; ++i)
		ctx.fillText(helpText[i], dx, dy + (23 * i));
	
}

// draw graphics that related to the game canvas
function drawLayerGame()
{
	// get the reference of the canvas element and the drawing context.
	var ctx = untangleGame.layers[2];
	var level = untangleGame.levels[untangleGame.currentLevel];
	
	// draw the game state visually
	// clear the canvas before drawing.
	clear(ctx);
	
	if (untangleGame.flags["path"]) DrawMoonPath(ctx);
	DrawMoons(ctx, level);
	
	DrawDomainLinks(ctx, level);
	DrawDomains(ctx, level);
}

function updateLevel(delta)
{
	level = untangleGame.currentLevel + delta
	if (level < 0) level = untangleGame.levels.length - 1
	level = level % untangleGame.levels.length
		
	untangleGame.currentLevel = level
	day = untangleGame.day
	setupCurrentLevel();
	untangleGame.day = day
	updateDay(untangleGame.day)
	pauseAutoUpdate();	
}

function ToggleFlag(flag)
{
	untangleGame.flags[flag] = untangleGame.flags[flag] ?? false
	untangleGame.flags[flag] = !untangleGame.flags[flag]
}



var debug = true;

/*
Clicking a domain selects it & enables dragging

Return - Center current domain focus
D - Debug mode
H - Toggle visibility of all but the domain focus & neighbors
Shift + H - Hide only the domain focus
V - Toggle moving on the current domain focus
R / Esc - Unselect everything / reset
Tab - Cycle domain focus
Shift + [ or ] - Toggle through "levels" / configurations
0-9: Set number of steps from specified domain
A - Toggle visibility of allied domains
E - Toggle visibility of enemy domains
S - Toggle visibility of spied domains
X - Toggle arrangement of annexed domains
T - Toggle visibility of misc domains
*/

$(function(){
	// prepare layer 0 (bg)
	var canvas_bg = document.getElementById("bg");
	untangleGame.layers[0] = canvas_bg.getContext("2d");
	
	// prepare layer 1 (UI)
	var canvas_ui = document.getElementById("ui");
	untangleGame.layers[1] = canvas_ui.getContext("2d");

	// prepare layer 2 (game)
	var canvas = document.getElementById("game");  
	var ctx = canvas.getContext("2d");
	untangleGame.layers[2] = ctx;
	
	// draw a splash screen when loading the game background
	// draw gradients background
	var bg_gradient = ctx.createLinearGradient(0,0,0,ctx.canvas.height);
	bg_gradient.addColorStop(0, "#cccccc");
	bg_gradient.addColorStop(1, "#efefef");
	ctx.fillStyle = bg_gradient;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	
	// draw the loading text
	ctx.font = "34px 'Arial'";
	ctx.textAlign = "center";
	ctx.fillStyle = "#333333";
	ctx.fillText("loading...",ctx.canvas.width/2,canvas.height/2);

	// setup current level
	setupCurrentLevel();
	
	// load the background image
	
	untangleGame.background = new Image();	
	untangleGame.background.onload = function() 
	{
		// setup an interval to loop the game loop
		setInterval(gameloop, 30);
		startAutoUpdate();
	}
	untangleGame.background.onerror = function() 
	{
		console.log("Error loading the image.");
	}
	untangleGame.background.src = untangleGame.backgroundSrc;	
	console.log(untangleGame.background.src)
	

	
	$( "#slider" ).slider({
		range: "min",
		value: 1,
		min: 1,
		max: 365+1,
		slide: function( event, ui ) {
			pauseAutoUpdate();
			updateDay(ui.value);
		}
	});
	
	$("#layers").click(function(e) 
	{	
		var canvasPosition = $(this).offset();		
		var mouseX = e.originalEvent.layerX || 0;
		var mouseY = e.originalEvent.layerY || 0;

		var ch = ctx.canvas.height;
		var cx = ctx.canvas.width * 0.5;
		var cy = ctx.canvas.height * 0.5;
		var left = mouseX < (cx - cy);
		var right = mouseX > (cx + cy);
		
		if (left)
			updateLevel(-1)
		else if (right)
			updateLevel(1)
		else
		{
			pauseAutoUpdate();
			updateDay((untangleGame.day + 1) % 365)
		}
	})
	
	$(window).keydown(function (e) 
	{
		var dirty = false;
		var key = String.fromCharCode(e.which).toLowerCase();
		
		if (key == "p")
		{
			ToggleFlag("path");
		}
		else if (key == "b")
		{
			ToggleFlag("background");
		}
		else if (key == "l")
		{
			ToggleFlag("Labels");
		}
		else if (key == "t")
		{
			ToggleFlag("text");
		}
		else if (key == "n")
		{
			updateLevel(1)
		}
		else if ((key == "q")||(key == "m")||(key == "a"))
		{
			moon = untangleGame.moons.map(m => m.name.toLowerCase()).filter(m => m[0] == key);
			if (moon && moon.length > 0) moon = moon[0] 
			else return;
			const flag = "phaseIcons"+moon
			untangleGame.flags[flag] = untangleGame.flags[flag] ?? false
			untangleGame.flags[flag] = !untangleGame.flags[flag]
		}
		else if (e.which == 32) //spacebar
		{
			if (untangleGame.autoUpdate)
				pauseAutoUpdate();
			else
				startAutoUpdate();
		}
		else
		{
			//alert(e.which);
		}
	})
		
/*	    
    // we move the target dragging domain when the mouse is moving
    $("#layers").mousemove(function(e) 
	{
    	if (untangleGame.targetDomain != undefined)
	   	{
			var canvasPosition = $(this).offset();
			
			var mouseX = e.originalEvent.layerX || 0;
			var mouseY = e.originalEvent.layerY || 0;
			var radius = untangleGame.domains[untangleGame.targetDomain].radius;
			var name = untangleGame.domains[untangleGame.targetDomain].name;
			// untangleGame.domains[untangleGame.targetDomain] = new Domain(name, mouseX, mouseY, radius);	
			untangleGame.domains[untangleGame.targetDomain].x = mouseX;
			untangleGame.domains[untangleGame.targetDomain].y = mouseY;

			adjustAnnex(untangleGame.targetDomain, 
						calculateAngle(untangleGame.domains[untangleGame.targetDomain]), 
						calculateCenter(), defaultRadius);			
	   	}
	});

	$("#layers").click(function(e) 
	{
    	var canvasPosition = $(this).offset();
    	var mouseX = e.originalEvent.layerX || 0;
    	var mouseY = e.originalEvent.layerY || 0;	      
	
		for(var i in untangleGame.domains)
		{
			var domainX = untangleGame.domains[i].x;
			var domainY = untangleGame.domains[i].y;
			var radius = untangleGame.domains[i].radius;
			if (Math.pow(mouseX-domainX,2) + Math.pow(mouseY-domainY,2) < Math.pow(radius,2))
			{
				if (untangleGame.targetDomain == undefined)
				{
					untangleGame.targetDomain = i;
					bReset = false;
				}
		    	else if (untangleGame.targetDomain == i)
				{
					untangleGame.targetDomain = undefined;					
					if (untangleGame.flags["Debug"])
						alert("("+domainX+","+domainY+")");
				}
				
				break;
			}
		}		
	});

	$(window).keyup(function (e) 
	{
		if (e.which == 16)	//Un-shift
			untangleGame.flags["Shift"] = false;
	});
	
	$(window).keydown(function (e) 
	{
		var dirty = false;
//		alert(e.which);
		var key = String.fromCharCode(e.which);

		if (e.which == 16)	//shift
		{
			untangleGame.flags["Shift"] = true;
		}
		
		if (e.which == 27)	//Esc - Uncenter/untarget all domains
		{
			untangleGame.flags = [];
			setupDefaultFlags();
			
			focus = undefined;
			dirty = true;
		}
		else if ((e.which == 13)||(key == "C"))	//Return/C - Center the current focus
		{
		}
		else if (e.which == 9)	//Tab - Cycle the focus through the domains
		{
			var level = untangleGame.levels[untangleGame.currentLevel];	
			var numDomains = Object.size(level.domains);
			return false;
		}
			
		var focus = undefined;
		
		if ((key == "9")||(key == "8")||(key == "7")||
			(key == "6")||(key == "5")||(key == "4")||
			(key == "3")||(key == "2")||(key == "1")||
			(key == "0"))	//Set steps to the specified number
		{
			untangleGame.visSteps = parseInt(key);
			if (focus != undefined)
			{
				untangleGame.flags["H"] = true;
				dirty = true;
			}
		}
		else if (key == "R")	//R - Reset (same as Esc)
		{
			untangleGame.flags = [];
			setupDefaultFlags();

			focus = undefined;
			dirty = true;

		}
		else if (key == "X")	//X - Toggle arrangement of annex domains
		{
			untangleGame.flags["annex"] = !untangleGame.flags["annex"];
		}
		else if (key == "V")	//V - Move the focused domain
		{
			if (untangleGame.targetDomain != undefined)
			{
				untangleGame.targetDomain = undefined;
				dirty = true;
			}
			else if (untangleGame.targetDomain != focus)
			{
				untangleGame.targetDomain = focus;				
				dirty = true;
			}		
		}
		else if (key == "H")	//H - Toggle visibility
		{
			if (untangleGame.flags["Shift"])
			{
				dirty = false;
				if (focus != undefined)
				{
					untangleGame.domains[focus].visible = !untangleGame.domains[focus].visible;
				}
			}
			else
			{
				untangleGame.flags[key] = !untangleGame.flags[key];
				dirty = true;
			}			
		}
		else if ((e.which == 219)&&(untangleGame.flags["Shift"]))	//"[" Scroll through levels
		{
			if (untangleGame.currentLevel-1 >= 0)
				untangleGame.currentLevel--;
			else
				untangleGame.currentLevel = untangleGame.levels.length - 1;
			
			setupCurrentLevel();
		}
		else if ((e.which == 221)&&(untangleGame.flags["Shift"]))	//"]" Scroll through levels
		{
			if (untangleGame.currentLevel+1 < untangleGame.levels.length)
				untangleGame.currentLevel++;
			else
				untangleGame.currentLevel = 0;
			
			setupCurrentLevel();
		}
		else if (key == "D")
		{
			untangleGame.flags["Debug"] = !untangleGame.flags["Debug"];			
		}
		else if (key == "A")
		{
			untangleGame.flags["hidealliedDomains"] = !untangleGame.flags["hidealliedDomains"];			
			untangleGame.flags["hideannexDomains"] = !untangleGame.flags["hideannexDomains"];			
		}
		else if (key == "E")
		{
			untangleGame.flags["hideenemyDomains"] = !untangleGame.flags["hideenemyDomains"];			
		}
		else if (key == "T")
		{
			untangleGame.flags["hidemiscDomains"] = !untangleGame.flags["hidemiscDomains"];			
		}
		else if (key == "I")
		{
			untangleGame.flags["incoming"] = !untangleGame.flags["incoming"];
		}
		else if (key == "O")
		{
			untangleGame.flags["outgoing"] = !untangleGame.flags["outgoing"];
		}		
		else if (key == "L")
		{
			untangleGame.flags["Labels"] = !untangleGame.flags["Labels"];
			dirty = true;			
		}
				
		if (dirty)
		{
			dirty = false;
			updateDomainVisibility(focus, !untangleGame.flags["H"], untangleGame.visSteps);
			arrangeDomains();
		}		
	});
*/
});

