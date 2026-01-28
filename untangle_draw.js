function clear(ctx) 
{	
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
}

function drawLine(ctx, x1, y1, x2, y2, color1, color2, thickness, label="", avoidPoints=[]) 
{		
	ctx.beginPath();
	ctx.lineWidth = thickness;
	
	var domain_gradient = ctx.createLinearGradient(x1,y1,x2,y2);
	domain_gradient.addColorStop(0, color1);
	domain_gradient.addColorStop(1, color2);	
	ctx.fillStyle = domain_gradient;
	ctx.strokeStyle = domain_gradient;
	
    drawArrow(ctx,x1,y1,x2,y2,3,1,Math.PI/12,30, avoidPoints);
	
	if (untangleGame.flags["Labels"])
	{
		//Text label
		label_x = (x1 + x2) / 2;
		label_y = (y1 + y2) / 2;
		
		var dY = y2 - y1;
		var dX = x2 - x1;
		var angleRad = Math.atan(dY / dX);

		ctx.translate(label_x, label_y);
		ctx.rotate(angleRad);

		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.font = "14px Arial";
		ctx.fillText(label, 0, 0);		
		
		ctx.rotate(-angleRad);
		ctx.translate(-label_x, -label_y);		
	}
}

function drawPoly(ctx)
{
	ctx.fillStyle = colors["alliedDomains"];
	ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(100,50);
		ctx.lineTo(50, 100);
		ctx.lineTo(0, 90);
	ctx.closePath();
	ctx.fill();
}

var drawArrow=function(ctx,x1,y1,x2,y2,style,which,angle,d, avoidPoints)
{
	'use strict';
	style=typeof(style)!='undefined'? style:3;
	which=typeof(which)!='undefined'? which:1; // end point gets arrow
	angle=typeof(angle)!='undefined'? angle:Math.PI/8;
	d    =typeof(d)    !='undefined'? d    :10;
	// default to using drawHead to draw the head, but if the style
	// argument is a function, use it instead
	var toDrawHead=typeof(style)!='function'?drawHead:style;
	
	// For ends with arrow we actually want to stop before we get to the arrow
	// so that wide lines won't put a flat end on the arrow.
	//
	var dist=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
	var ratio=(dist-d/3)/dist;
	var tox, toy,fromx,fromy;
	if(which&1)
	{
		tox=x1+(x2-x1)*ratio;
		toy=y1+(y2-y1)*ratio;
	}
	else
	{
		tox=x2;
		toy=y2;
	}
	
	if(which&2)
	{
		fromx=x1+(x2-x1)*(1-ratio);
		fromy=y1+(y2-y1)*(1-ratio);
	}
	else
	{
		fromx=x1;
		fromy=y1;
	}
	
	// Draw the shaft of the arrow
	ctx.beginPath();
	ctx.moveTo(fromx,fromy);

	//Try to curve the line around other points.
	for (var d in avoidPoints)
	{
		var domain = avoidPoints[d];
			
		var color = ctx.strokeStyle;
		var start = new Point(fromx, fromy);
		var end = new Point(tox, toy);
		var center = new Point(domain.x, domain.y);
	
		var projection = findclosestpoint(start, end, center);

		var intersects = intersect(start, end, projection, avoidRadius);
			
		var firstPoint = new Point(end.x - start.x, end.y - start.y);
		firstPoint.x *= intersects.x;
		firstPoint.y *= intersects.x;
		firstPoint.x += start.x;
		firstPoint.y += start.y;

		//Draw from start to first intersection point.
		ctx.lineTo(firstPoint.x, firstPoint.y);
		
		var secondPoint = new Point(end.x - start.x, end.y - start.y);
		secondPoint.x *= intersects.y;
		secondPoint.y *= intersects.y;
		secondPoint.x += start.x;
		secondPoint.y += start.y;

		var vect = new Point(center.x - projection.x, center.y - projection.y);
		vect = normal(vect);
		vect.x *= -avoidRadius * 2;
		vect.y *= -avoidRadius * 2;

		//Draw curve from first intersection point to second	
		ctx.quadraticCurveTo(vect.x + projection.x, vect.y + projection.y, secondPoint.x, secondPoint.y);
		ctx.lineTo(secondPoint.x, secondPoint.y);
			
		fromx = secondPoint.x;
		fromy = secondPoint.y;
	}
	
	ctx.lineTo(tox,toy);
	ctx.stroke();
		
	// calculate the angle of the line
	var lineangle=Math.atan2(y2-y1,x2-x1);
	// h is the line length of a side of the arrow head
	var h=Math.abs(d/Math.cos(angle));
		
	return;
	
	if(which&1)
	{	// handle far end arrow head
		var angle1=lineangle+Math.PI+angle;
		var topx=x2+Math.cos(angle1)*h;
		var topy=y2+Math.sin(angle1)*h;
		var angle2=lineangle+Math.PI-angle;
		var botx=x2+Math.cos(angle2)*h;
		var boty=y2+Math.sin(angle2)*h;
		toDrawHead(ctx,topx,topy,x2,y2,botx,boty,style);		
	}
	if(which&2)
	{ // handle near end arrow head
		var angle1=lineangle+angle;
		var topx=x1+Math.cos(angle1)*h;
		var topy=y1+Math.sin(angle1)*h;
		var angle2=lineangle-angle;
		var botx=x1+Math.cos(angle2)*h;
		var boty=y1+Math.sin(angle2)*h;
		toDrawHead(ctx,topx,topy,x1,y1,botx,boty,style);
	}
}

var drawHead=function(ctx,x0,y0,x1,y1,x2,y2,style)
{
	'use strict';
	// all cases do this.
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x0,y0);
	ctx.lineTo(x1,y1);
	ctx.lineTo(x2,y2);
	switch(style)
	{
    case 0:
		// curved filled, add the bottom as an arcTo curve and fill
		var backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
		ctx.arcTo(x1,y1,x0,y0,.55*backdist);
		ctx.fill();
		break;
    case 1:
		// straight filled, add the bottom as a line and fill.
		ctx.lineTo(x0,y0);
		ctx.fill();
		break;
    case 2:
		// unfilled head, just stroke.
		ctx.stroke();
		break;
    case 3:
		//filled head, add the bottom as a quadraticCurveTo curve and fill
		var cpx=(x0+x1+x2)/3;
		var cpy=(y0+y1+y2)/3;
		ctx.quadraticCurveTo(cpx,cpy,x0,y0);
		ctx.fill();
		break;
    case 4:
		//filled head, add the bottom as a bezierCurveTo curve and fill
		var cp1x, cp1y, cp2x, cp2y,backdist;
		var shiftamt=5;
		if(x2==x0)
		{
			// Avoid a divide by zero if x2==x0
			backdist=y2-y0;
			cp1x=(x1+x0)/2;
			cp2x=(x1+x0)/2;
			cp1y=y1+backdist/shiftamt;
			cp2y=y1-backdist/shiftamt;
		}
		else
		{
			backdist=Math.sqrt(((x2-x0)*(x2-x0))+((y2-y0)*(y2-y0)));
			var xback=(x0+x2)/2;
			var yback=(y0+y2)/2;
			var xmid=(xback+x1)/2;
			var ymid=(yback+y1)/2;
		
			var m=(y2-y0)/(x2-x0);
			var dx=(backdist/(2*Math.sqrt(m*m+1)))/shiftamt;
			var dy=m*dx;
			cp1x=xmid-dx;
			cp1y=ymid-dy;
			cp2x=xmid+dx;
			cp2y=ymid+dy;
		}

		ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x0,y0);
		ctx.fill();
		break;
	}
	ctx.restore();
};

function drawDomain(ctx, x, y, radius, color1, color2) 
{
	// prepare the radial gradients fill style
	var domain_gradient = ctx.createRadialGradient(x-3,y-3,1,x,y,radius);
	domain_gradient.addColorStop(0, color1);
	domain_gradient.addColorStop(1, color2);
	ctx.fillStyle = domain_gradient;
	
	// draw the path
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
}

