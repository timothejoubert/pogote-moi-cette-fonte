/* ref : 
https://codepen.io/netsi1964/pen/pJzWoz?editors=0010
*/

console.log("svg");

var iPosition = 0;

function points(iCount, current) {
	if (iCount <= 0) {
		iPosition += 1;
		return current;
	}
	if (typeof current !== "undefined") {
		iPosition += 1;
	} else {
		current = "";
	}
	return points(
		--iCount,
		current + "%" + iPosition + "% %" + ++iPosition + "% "
	);
}

function addCommand(sType) {
	var ucCommand = sType.toUpperCase();
	if ("ML".indexOf(ucCommand) > -1) {
		return sType + " " + points(1);
	} else {
		if ("C".indexOf(ucCommand) > -1) {
			return sType + " " + points(3);
		} else {
			if ("Q".indexOf(ucCommand) > -1) {
				return sType + " " + points(2);
			} else {
				if ("C".indexOf(ucCommand) > -1) {
					return sType + " " + points(5);
				}
			}
		}
	}
}

function addCommands(sCommands, data) {
	var d = "";
	for (var i = 0; i < sCommands.length; i++) {
		d += addCommand(sCommands.substr(i, 1));
	}
	var result = {
		d: d,
		data: []
	};
	for (var i = 0; i < iPosition; i++) {
		result.data.push(typeof data[i] !== "undefined" ? data[i] : 0);
	}
	return result;
}

var cx = 100,
	cy = 250,
	draw = addCommands("MLLLLLLCCLCCLLLL", [
		100, 50, 
		200, 50, 
		200, 150, 
		400, 150, 
		400, 250, 
		200, 250, 
		200, 400, 
		200, 400, 200, 450, 250, 450, 
		300, 450, 300, 400, 300, 400, 
		400, 400, 
		400, 450, 400, 550, 250, 550, 
		100, 550, 100, 450, 100, 400 ,
		100, 250, 
		0, 250, 
		0, 150, 
		100, 150,
]),
	curves = [
		{
			d: draw.d + "Z",
			init: draw.data
		}
	],
	curve = "",
	currentCurve = 0,
	$curve = $("#curve"),
	$data = $(".data"),
	$log = $(".log"),
	$exportshape = $(".link__graphic--arc"),
	$grid = $("#grid"),
	$monAnimate = $("#monAnimate"),
	active = -1;

function setActive(a) {
	if (a !== active) {
		// console.log(a);
	}
	active = a;
}

// Find your root SVG element
var svg = document.querySelector("#mySvg");
// Create an SVGPoint for future math
var pt = svg.createSVGPoint();

// Get point in global SVG space
function cursorPoint(evt) {
	var touches = evt.changedTouches;
	if (touches) {
		return getXY(touches[0].clientX, touches[0].clientY, true)
	}
	return getXY(evt.clientX, evt.clientY, true);
}

function getXY(x, y, inverse) {
	pt.x = x;
	pt.y = y;
	return !!inverse ? pt.matrixTransform(svg.getScreenCTM().inverse()) : pt;
}

function generateCurveData(x, y, activePoint) {
	var curveToDraw = curves[currentCurve];
	var d = curveToDraw.d;
	var sHTML = curveToDraw.d;
	var points = curveToDraw.init;
	var ptno = 0;
	for (var point = 0; point < points.length; point += 2) {
		var px = ptno === activePoint
			? x
			: typeof points[point] === "undefined" ? 0 : points[point];
		var py = ptno === activePoint
			? y
			: typeof points[point + 1] === "undefined" ? 0 : points[point + 1];
		curveToDraw.init[point] = px;
		curveToDraw.init[point + 1] = py;
		d = d.replace("%" + point + "%", px).replace("%" + (point + 1) + "%", py);
		sHTML = sHTML
			.replace("%" + point + "%", (ptno === activePoint ? "<mark>" : "") + px)
			.replace(
				"%" + (point + 1) + "%",
				py + (ptno === activePoint ? "</mark>" : "")
			);
		ptno++;
	}
	var curveData = {
		d: d,
		html: sHTML
	};
	return curveData;
}

function handleMouseMove(evt) {
	var loc = cursorPoint(evt);
	var x = loc.x;
	var y = loc.y;

	if (evt.buttons !== 0 || curve == "") {
		curve = generateCurveData(x, y, active);
	}

	var grid = curve.d.replace(/[^0-9.]/g, " ").split(" ").filter(function(ele) {
		return ele != "";
	});
	var sGrid = "";
	var ptno = 0;
	var path = "";
	var gridPath = '<path class="gridPath" d="M %path%" />';
	for (var point = 0; point < grid.length; point += 2) {
		var pt = getXY(grid[point], grid[point + 1]);
		sGrid +=
			'<use ' +
			'class="tim"'+
			'data-x="'+pt.x +'"'+
			'data-y="'+pt.y +'"'+
			'onmousemove="setActive(' +
			ptno +
			')" xlink:href="#' +
			(ptno == active ? "crossFilled" : "cross") +
			'" x="' +
			pt.x +
			'" y="' +
			pt.y +
			// '" style="' +(ptno == active ? "fill:red" : "") +
			'"  />\n';
		path += (ptno === 1 ? "L " : "") + grid[point] + " " + grid[point + 1] + " ";
		ptno++;
	}
	sGrid += gridPath.replace("%path%", path);
	// $log.html('&lt;path d="' + curve.html + '" &gt;');
	// $exportshape.html('<path d="' + curve.d + '"  pathLength="1"  >');
	$grid.html(sGrid);
	$("#monAnimate").attr("to", curve.d)
	$data.text(curves[currentCurve].init);
	$curve.html('<path d="' + curve.d + '" > ');

}

svg.addEventListener("mousemove", handleMouseMove, false);
svg.addEventListener("touchmove", handleMouseMove, false);

document.addEventListener("keyup", function(evt) {
	// console.log(evt);
	switch (evt.keyCode) {
		case 38: // UP
			active--;
			// console.log(evt.keyCode);
			
			break;
		case 40: // Down
			active++;
			// console.log(evt.keyCode);
			point.splice(-1,1);
			handleMouseMove(evt)

			break;
		default:
		// console.log(evt.keyCode);
	}
	
});


// 3. aug. 2017 Added init draw
let pseudoEvt = {
  clientX: 0,
  clientY: 0,
  buttons: 0
}
handleMouseMove(pseudoEvt)


