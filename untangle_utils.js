function getJsonFromUrl() {
  var query = location.search.substr(1);
  var result = {};
  query.split("&").forEach(function(part) {
    var item = part.split("=");
    result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

Math.mround = function(val) {
	return Math.round((val + Number.EPSILON) * 100) / 100
}

Math.clamp = function (num, min, max) {
  return Math.min(Math.max(num, min), max);
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// return true if b is between a and c,
// we exclude the result when a==b or b==c
function isInBetween(a, b, c) {
	// return false if b is almost equal to a or c.
	// this is to elmiate some floating point when
	// two value is equal to each other but different with 0.00000...0001
	if (Math.abs(a-b) < 0.000001 || Math.abs(b-c) < 0.000001) {
		return false;
	}
	
	// true when b is in between a and c
	return (a < b && b < c) || (c < b && b < a);
}


function findSegmentIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false;
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (denominator === 0) {
        return false;
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        let x = x1 + ua * (x2 - x1);
        let y = y1 + ua * (y2 - y1);
        return { x, y };
    }

    return false;
}

function getIntersect(line1, line2)
{
	if ((typeof(line1.startPoint) == 'undefined') || 
		(typeof(line1.endPoint) == 'undefined') || 		
		(typeof(line2.startPoint) == 'undefined') || 
		(typeof(line2.endPoint) == 'undefined'))
		{
			return null;
		}

	// convert line1 to general form of line: Ax+By = C
	var a1 = line1.endPoint.y - line1.startPoint.y;
	var b1 = line1.startPoint.x - line1.endPoint.x;
	var c1 = a1 * line1.startPoint.x + b1 * line1.startPoint.y;
	
	// convert line2 to general form of line: Ax+By = C
	var a2 = line2.endPoint.y - line2.startPoint.y;
	var b2 = line2.startPoint.x - line2.endPoint.x;
	var c2 = a2 * line2.startPoint.x + b2 * line2.startPoint.y;
	
	// calculate the intersection point		
	var d = a1*b2 - a2*b1;
	
	// parallel when d is 0
	if (d == 0) 
	{
		return null;
	}else {
		var x = (b2*c1 - b1*c2) / d;
		var y = (a1*c2 - a2*c1) / d;
					
		// check if the interception point is on both line segments
		if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
			(isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) 
		{
			return {x,y};	
		}
	}
	
	return null;
}

function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
function distToSegmentSquared(p, v, w) {
  var l2 = dist2(v, w);
  if (l2 == 0) return dist2(p, v);
  var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  if (t < 0) return dist2(p, v);
  if (t > 1) return dist2(p, w);
  return dist2(p, { x: v.x + t * (w.x - v.x),
                    y: v.y + t * (w.y - v.y) });
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function dotproduct(a,b) 
{
	var dot = (a.x * b.x + a.y * b.y);
	return dot;
}

function findclosestpoint(a,b,p)
{
	var a_to_p = new Point(p.x - a.x, p.y - a.y);
	var a_to_b = new Point(b.x - a.x, b.y - a.y);

	var atb2 = a_to_b.x * a_to_b.x + a_to_b.y * a_to_b.y;	
	var atp_dot_atb = dotproduct(a_to_p, a_to_b);

	var t = atp_dot_atb / atb2          //The normalized "distance" from a to your closest point

	return new Point( a.x + a_to_b.x * t, a.y + a_to_b.y * t );
}

function magnitude(v)
{
	return Math.sqrt(v.x*v.x + v.y*v.y);
}

function normal(v)
{
	var vecLen = magnitude(v)
	var scale = 1/vecLen;
	nx = v.x * scale;
	ny = v.y * scale;

	return new Point(nx, ny);
}

function intersect(start, end, center, radius)
{
	var d = new Point(end.x - start.x, end.y - start.y);
	var f = new Point(start.x - center.x, start.y - center.y);

	var a = dotproduct(d,d);
	var b = 2 * dotproduct(f, d);
	var c = dotproduct(f, f) - (radius * radius);

	var discriminant = b*b-4*a*c;

	if( discriminant < 0 )
	{
		// no intersection
		return (new Point(0,0));
	}
	else
	{
		// ray didn't totally miss sphere, there is a solution to the equation.
		discriminant = Math.sqrt( discriminant );

		// either solution may be on or off the ray so need to test both
		// t1 is always the smaller value, because BOTH discriminant and a are nonnegative.
		var t1 = (-b - discriminant)/(2*a);
		var t2 = (-b + discriminant)/(2*a);

		// 3x HIT cases:
		//          -o->             --|-->  |            |  --|->
		// Impale(t1 hit,t2 hit), Poke(t1 hit,t2>1), ExitWound(t1<0, t2 hit), 

		// 3x MISS cases:
		//       ->  o                     o ->              | -> |
		// FallShort (t1>1,t2>1), Past (t1<0,t2<0), CompletelyInside(t1<0, t2>1)

		if (t1 >= 1)
			t1 = 0;
		if (t2 >= 1)
			t2 = 0;
			
		return (new Point(t1, t2));
	}
}

function compareDist(a,b) {
  if (a.distFromStart < b.distFromStart)
     return -1;
  if (a.distFromStart > b.distFromStart)
    return 1;
  return 0;
}

function calculateCenter()
{
	var level = untangleGame.levels[untangleGame.currentLevel];	

	numDomains = 0;
	center_x = 0;
	center_y = 0;
	
	for (var key in level.domains) 
	{
		if (untangleGame.domains[key].visible)
		{
			center_x += untangleGame.domains[key].x;
			center_y += untangleGame.domains[key].y;
			++numDomains;
		}
	}	

	if (numDomains > 0)
	{
		center_x /= numDomains;
		center_y /= numDomains;
	}
	
	return new Point(center_x, center_y);
}

function calculateAngle(point, center = null)
{
	center = center ?? calculateCenter();
	
	deltaY = point.y - center.y;
	deltaX = point.x - center.x;

	norm = normal({x:deltaX, y:deltaY})
	
	deltaY = norm.y
	deltaX = norm.x
	
	angle = Math.atan2(deltaY, deltaX);
	return angle;
}


Math.angleRad = function (u, v) {
	const dot = dotproduct(u, v)
	const magU = magnitude(u)
	const magV = magnitude(v)
	const cos = dot / (magU * magV)
	const angle = Math.acos(cos)
	return angle
}

Math.angleDeg = function(u,v) {
	return Math.degrees(Math.angleRad(u,v));
}

function offsetPointToCenter(P, C, d)
{
	h = C.x
	k = C.y
	x = P.x
	y = P.y
	r = Math.sqrt(sqr(x-h)+sqr(y-k))
	
	// Calculate the normalized Unit Vector (Direction towards center)
	nx = (h-x) / r
	ny = (k-y) / r
	
	// Calculate the new point
	px = x + d * nx
	py = y + d * ny
	
	return {x:px, y:py}
}

function blendColors(colorA, colorB, amount = 0.5) {
  const [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  const [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  const r = Math.round(rA + (rB - rA) * amount).toString(16).padStart(2, '0');
  const g = Math.round(gA + (gB - gA) * amount).toString(16).padStart(2, '0');
  const b = Math.round(bA + (bB - bA) * amount).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}