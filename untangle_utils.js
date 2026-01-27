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


function isIntersect(line1, line2)
{
	if ((typeof(line1.startPoint) == 'undefined') || 
		(typeof(line1.endPoint) == 'undefined') || 		
		(typeof(line2.startPoint) == 'undefined') || 
		(typeof(line2.endPoint) == 'undefined') ||
		!line1.startPoint.visible ||
		!line1.endPoint.visible ||
		!line2.startPoint.visible ||
		!line2.endPoint.visible)
		{
			return false;
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
		return false;
	}else {
		var x = (b2*c1 - b1*c2) / d;
		var y = (a1*c2 - a2*c1) / d;
					
		// check if the interception point is on both line segments
		if ((isInBetween(line1.startPoint.x, x, line1.endPoint.x) || isInBetween(line1.startPoint.y, y, line1.endPoint.y)) &&
			(isInBetween(line2.startPoint.x, x, line2.endPoint.x) || isInBetween(line2.startPoint.y, y, line2.endPoint.y))) 
		{
			return true;	
		}
	}
	
	return false;
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

function normal(v)
{
	var vecLen = Math.sqrt(v.x*v.x + v.y*v.y);
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

function calculateAngle(domain)
{
	var point = calculateCenter();
	deltaY = domain.y - point.y;
	deltaX = domain.x - point.x;

	angle = Math.atan2(deltaY, deltaX);
	return angle;
}
