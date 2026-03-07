function Point(x, y)
{
	this.x = x;
	this.y = y;
}

function Line(startPoint, endPoint, type, label, color1, color2, thickness) 
{
	this.startPoint = startPoint;
	this.endPoint = endPoint;
	this.thickness = 3;
	this.type = type;
	this.label = label || "";
	this.color = [];
	if (typeof(color1) != 'undefined')
		this.color[0] = color1;
	else
		this.color[0] = linkColors[type][0];
		
	if (typeof(color2) != 'undefined')
		this.color[1] = color2;
	else
		this.color[1] = linkColors[type][1];
}

function Domain(name, x, y, radius){
	this.name = name;
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.distFromStart = 0;
	this.visible = true;
	
	this.visited = false;
}

function Moon(moon) {
	this.name = moon.name;
	this.cycle = moon.cycle ?? 28;
	this.sidereal = moon.sidereal ?? null;
	this.offset = moon.offset ?? 0;
	this.phases = moon.phases || ["🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔"];
	this.parent = moon.parent;
	this.path = moon.path || [];
	this.pathColor = moon.pathColor;
	this.dir = moon.dir || 1;
	this.r = moon.size ?? defaultMoonSize;
	this.d = moon.dist ?? defaultMoonDist;
	this.x = 0;
	this.y = 0;
	this.p = 0;
	this.isSun = moon.isSun ?? false;
}