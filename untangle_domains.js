
function connectDomains()
{
	// setup all lines based on the domains relationship
	var level = untangleGame.levels[untangleGame.currentLevel];
	untangleGame.lines.length = 0;
	
	var vertices = Object.size(untangleGame.domains);
	var edges = 0;
	
	
	for (var key in level.domains) 
	{
		var startPoint = untangleGame.domains[key];
	
		for (var linkType in level.domains[key])
		{
			var connectedDomains = level.domains[key][linkType];
			for (var connection in connectedDomains)
			{
				var domainLink = connectedDomains[connection];
				domainLink = domainLink.split("|");
				var linkLabel = domainLink[1];
				var color1Override = domainLink[2];
				var color2Override = domainLink[3];
				domainLink = domainLink[0].trim();
				
				if (typeof linkLabel === 'string') 
					linkLabel = linkLabel.trim();

				var bUseColor1 = false;
				var bUseColor2 = false;
				if (typeof color1Override === 'string') 
				{
					color1Override = color1Override.trim();
					bUseColor1 = true;
				}
				if (typeof color2Override === 'string') 
				{
					color2Override = color2Override.trim();
					bUseColor2 = true;
				}

				var endPoint = untangleGame.domains[domainLink];
				
				var lineExists = false;
				for (var line in untangleGame.lines)
				{
					lineExists = (((line.startPoint == startPoint) && (line.endPoint == endPoint))||
								  ((line.startPoint == endPoint) && (line.endPoint == startPoint)));
				}				
				if (!lineExists)
				{
					++edges;
				}
				
				if (bUseColor1 && bUseColor2)
					untangleGame.lines.push(new Line(startPoint, endPoint, linkType, linkLabel, color1Override, color2Override));	//colors[linkType]));
				else if (bUseColor1)
					untangleGame.lines.push(new Line(startPoint, endPoint, linkType, linkLabel, color1Override));	//colors[linkType]));
				else
					untangleGame.lines.push(new Line(startPoint, endPoint, linkType, linkLabel));	//colors[linkType]));				
			}
		}
	}		
	
	return edges;
}


function updateDomainVisibility(center, visible, steps)
{
	if (steps == undefined)
		steps = 1;

	var level = untangleGame.levels[untangleGame.currentLevel];	

	//Loop over all domains.
	for (var key in level.domains) 
	{
		untangleGame.domains[key].visible = visible;
	}

	var debugText = "";
	if ((!visible)&&(center != undefined))
		debugText = "{\n" + updateDomainVisibility_rec(center, visible, steps, "", []) + "\n}";

	if (debug)
		$("#debug").html(debugText);

}


function updateDomainVisibility_rec(center, visible, steps, prefix, explored)
{
	var level = untangleGame.levels[untangleGame.currentLevel];	

	var newPrefix = prefix + "\t";
	var debugText = "";	//prefix + "Exploring " + center + ", " + steps + " steps"; 
	
	if (explored[center])
	{
		return newPrefix + center + " already explored. [END]\n";
	}
	else if (untangleGame.domains[center].visible)
	{
		debugText += newPrefix + center + " already visible ";
		if (steps > 0)
		{
			debugText += "{\n";
		}
		debugText += "\n";
	}
	else
	{
		//We want to show the center
		untangleGame.domains[center].visible = true;
		if ((steps > 0)&&(!explored[center]))
		{
			debugText += newPrefix + "Showing " + center + " (" + steps + ") {\n";			
			for (var linkType in level.domains[key])
			{
				debugText += newPrefix + "//(" + linkType + ": " + level.domains[center][linkType].join(",") + ")\n";
			}			
		}
	}

	if ((steps <= 0)||(explored[center]))
	{
		return debugText + newPrefix + "\t[END]\n";	// End of path;
	}
	
	explored[center] = true;
	
	for (var key in level.domains) 
	{
		for (var linkType in level.domains[key])
		{
			var connectedDomains = level.domains[key][linkType];
			for (var connection in connectedDomains)
			{
				//We want to show allies/enemies of the center
				if (key == center)
				{				
					debugText += updateDomainVisibility_rec(connectedDomains[connection], visible, steps-1, newPrefix, explored);
				}
				else if (connectedDomains[connection] == center)
				{
					debugText += updateDomainVisibility_rec(key, visible, steps-1, newPrefix, explored);
				}
				else
				{
					//debugText += newPrefix + "No link from " + center + " to " + connectedDomains[connection] + "\n";
				}
			}
		}
	}		
	
	debugText += newPrefix + "}\n";
	return debugText;
}	


function adjustAnnex(key, angle, center, radius)
{
	var level = untangleGame.levels[untangleGame.currentLevel];	

	//Check for annexed domains
	if (untangleGame.flags["annex"] && level.domains[key]["annexDomains"])
	{
		var annexAngle = angle;
		for (var a=0; a<level.domains[key]["annexDomains"].length; ++a)
		{
			var numAnnex = level.domains[key]["annexDomains"].length;

			var mult = (a % 2) ? 1 : -1;					
				
			var angleStep = ((Math.PI / 2) / (numAnnex / 2));
			annexAngle = ((a + (a % 2)) * mult * angleStep);
			annexAngle = angle - (annexAngle * 0.5) + ((1 - (numAnnex % 2)) * angleStep * 0.5);
			
			if (angle == 0)
				annexAngle += Math.radians(10);
			else if (angle == Math.PI)
				annexAngle -= Math.radians(10);
		
			var x = untangleGame.domains[key].x;
			var y = untangleGame.domains[key].y;
		
			var annex = level.domains[key]["annexDomains"][a];
			
			if (annex != center)
				positionDomain(annex, x, y, annexAngle, radius * 0.33);
		}
	}
}



function positionDomain(key, center_x, center_y, angle, _radius)
{
	var x = _radius * Math.cos(angle) + center_x;
	var y = _radius * Math.sin(angle) + center_y;
	
	if (typeof(untangleGame.domains[key]) == 'undefined')
		return;
	
	untangleGame.domains[key].x = x;
	untangleGame.domains[key].y = y;
	untangleGame.domains[key].visited = true;
}

function arrangeDomains(center)
{
	var level = untangleGame.levels[untangleGame.currentLevel];	
	
	{	
		var radius = defaultRadius;

		var numDomains = 0;	//Object.size(level.domains);
		
		for (var key in level.domains) 
		{
			if (untangleGame.domains[key].visible)
				++numDomains;
		}				

		if (level.domains.hasOwnProperty(center))
		{
			--numDomains;
		}

		if (untangleGame.flags["annex"])
		{
			//Check for annexed domains
			for (var key in level.domains) 
			{
				if (key != center && level.domains[key]["annexDomains"])
				{
					for (var a in level.domains[key]["annexDomains"])
					{
						var annex = level.domains[key]["annexDomains"][a];
						
						if ((untangleGame.domains[annex].visible)&&(annex != center))
							--numDomains;						
					}
				}
			}
		}	
		
		var ctx = untangleGame.layers[0];
		var center_x = ctx.canvas.width * 0.5;
		var center_y = ctx.canvas.height * 0.5;
		
		var i = 0;
		for (var key in level.domains) 
		{
			if (!untangleGame.domains[key].visited)
			{

				if (key == center)
				{
					untangleGame.domains[key].x = center_x;
					untangleGame.domains[key].y = center_y;			
					untangleGame.domains[key].visited = true;
				}
				else
				{
					var _radius = radius;
					var angle= (i * (2 * Math.PI) / numDomains);
										
					angle -= ((2 * Math.PI) / 4);	//Offset 90-degrees to make 0-deg start at the top instead of the right
					
					if (untangleGame.domains[key].visible)
						positionDomain(key, center_x, center_y, angle, radius);

//					adjustAnnex(key, angle, center, radius);
											
					if (untangleGame.domains[key].visible)
						++i;
				}
				
			}
		}
		
		for (var key in level.domains) 
		{
			untangleGame.domains[key].visited = false;
		}
	}
}



function DrawDomainLinks(ctx, level)
{
	// draw all remembered line	
	for(var i=0;i<untangleGame.lines.length;i++) 
	{
		var line = untangleGame.lines[i];
		var startPoint = line.startPoint;
		var endPoint = line.endPoint;
		var thickness = line.thickness;
		var color = line.color;
		var type = line.type;

		var rx = 0;
		var ry = 0;

		if ( (typeof(startPoint) != 'undefined') &&
			 (typeof(endPoint) != 'undefined') &&
			 (startPoint != endPoint))
		{	//Offset the arrow by a little bit to avoid overlap
			//Normalize the vector
			var x = endPoint.x - startPoint.x;
			var y = endPoint.y - startPoint.y;
			var v = new Point(x,y);
			v = normal(v);
			nx = v.x;
			ny = v.y;
						
			//Rotate the vector
			theta = Math.radians(90);	//deg2rad(90);
			cs = Math.cos(theta);
			sn = Math.sin(theta);
			rx = nx * cs - ny * sn; 
			ry = nx * sn + ny * cs;
			
			//Scale it
			rx = rx * linkOffsets[type];
			ry = ry * linkOffsets[type];
		}
	
		var hideIncoming = (endPoint.name != focus);
		var hideOutgoing = (startPoint.name != focus);
		if (!untangleGame.flags["incoming"])
			hideIncoming = false;
		if (!untangleGame.flags["outgoing"])
			hideOutgoing = false;
		if ((untangleGame.flags["incoming"])&&(untangleGame.flags["outgoing"]))
		{
			var temp = 	(endPoint.name == focus) || 
						(startPoint.name == focus)
			hideIncoming = !temp;
			hideOutgoing = !temp;
		}
			
		if ((typeof(startPoint) != 'undefined') &&
			(typeof(endPoint) != 'undefined') &&
			startPoint.visible && 
			endPoint.visible && 
			!untangleGame.flags["hide"+type] && 
			!hideIncoming && 
			!hideOutgoing)
		{
			var avoidPoints = [];
			
			for(var d in untangleGame.domains) 
			{
				var domain = untangleGame.domains[d];
				if (domain != startPoint && domain != endPoint && domain.visible)
				{
					var dist = distToSegment(domain,startPoint,endPoint);
					if (dist < domain.radius * 2)
					{
						domain.distFromStart = dist2(domain, startPoint);
						avoidPoints.push(domain);
					}
				}
			}
			avoidPoints.sort(compareDist);
					
			drawLine(ctx, startPoint.x + rx, 
						  startPoint.y + ry, 
						  endPoint.x + rx, 
						  endPoint.y + ry, 
						  color[0], 
						  color[1], 
						  thickness,
						  line.label,
						  avoidPoints);
		}
	}
}

function DrawDomains(ctx, level)
{		
	// draw all remembered domains
	var d = -1;
	for(var i in untangleGame.domains) 
	{
		++d;
		var domain = untangleGame.domains[i];
		if (domain.visible)
		{
			radius = domain.radius;
			var name = domain.name;
			var status = level.domainStatus?.[name] || "Active";
			if(typeof status == 'undefined')
				status = "Test";
		
			var colors = statusColors[status];
			drawDomain(ctx, domain.x, domain.y, radius, colors[0], colors[1]);

			if (untangleGame.flags["Labels"])
			{
				ctx.fillStyle = "#dddddd";
				ctx.textAlign = "center";
				ctx.textBaseline = "bottom";
				ctx.font = "bold 16px Arial";
				ctx.fillText(domain.name, domain.x, domain.y - 10);		
			}
		}	
	}
}

