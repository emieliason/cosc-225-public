const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point (x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;

    // Compare this Point to another Point p for the purposes of
    // sorting a collection of points. The comparison is according to
    // lexicographical ordering. That is, (x, y) < (x', y') if (1) x <
    // x' or (2) x == x' and y < y'.
    this.compareTo = function (p) {
	if (this.x > p.x) {
	    return 1;
	}

	if (this.x < p.x) {
	    return -1;
	}

	if (this.y > p.y) {
	    return 1;
	}

	if (this.y < p.y) {
	    return -1;
	}

	return 0;
    }

    // return a string representation of this Point
    this.toString = function () {
	return "(" + x + ", " + y + ")";
    }
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet () {
    this.points = [];
    this.curPointID = 0;

    // create a new Point with coordintes (x, y) and add it to this
    // PointSet
    this.addNewPoint = function (x, y) {
	this.points.push(new Point(x, y, this.curPointID));
	this.curPointID++;
    }

    // add an existing point to this PointSet
    this.addPoint = function (pt) {
	this.points.push(pt);
    }

    // sort the points in this.points 
    this.sort = function () {
	this.points.sort((a,b) => {return a.compareTo(b)});
    }

    // reverse the order of the points in this.points
    this.reverse = function () {
	this.points.reverse();
    }

    // return an array of the x-coordinates of points in this.points
    this.getXCoords = function () {
	let coords = [];
	for (let pt of this.points) {
	    coords.push(pt.x);
	}

	return coords;
    }

    // return an array of the y-coordinates of points in this.points
    this.getYCoords = function () {
	let coords = [];
	for (pt of this.points) {
	    coords.push(pt.y);
	}

	return coords;
    }

    // get the number of points 
    this.size = function () {
	return this.points.length;
    }

    // return a string representation of this PointSet
    this.toString = function () {
	let str = '[';
	for (let pt of this.points) {
	    str += pt + ', ';
	}
	str = str.slice(0,-2); 	// remove the trailing ', '
	str += ']';

	return str;
    }
}


function ConvexHullViewer (svg, ps) {
    this.svg = svg;  // a n svg object where the visualization is drawn
    this.ps = ps;    // a point set of the points to be visualized

    // COMPLETE THIS OBJECT
}

/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the 
 */
function ConvexHull (ps, viewer) {
    this.ps = ps;          // a PointSet storing the input to the algorithm
    this.viewer = viewer;  // a ConvexHullViewer for this visualization

    // start a visualization of the Graham scan algorithm performed on ps
    this.start = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // perform a single step of the Graham scan algorithm performed on ps
    this.step = function () {
	
	// COMPLETE THIS METHOD
	
    }

    // Return a new PointSet consisting of the points along the convex
    // hull of ps. This method should **not** perform any
    // visualization. It should **only** return the convex hull of ps
    // represented as a (new) PointSet. Specifically, the elements in
    // the returned PointSet should be the vertices of the convex hull
    // in clockwise order, starting from the left-most point, breaking
    // ties by minimum y-value.
    this.getConvexHull = function () {

        // set = new PointSet();
        // set.addNewPoint(12, 7);
        // set.addNewPoint(8, 8);
        // set.addNewPoint(17, 16);
        // set.addNewPoint(13, 14);
        // set.addNewPoint(17, 13);
        // set.addNewPoint(15, 11);
        // set.addNewPoint(6, 13);
        // set.addNewPoint(19, 5);
        // set.addNewPoint(9, 17);
        // set.addNewPoint(18, 9);
        // set.addNewPoint(6, 2);
        // set.addNewPoint(16, 6);
        // set.addNewPoint(5, 7);
        // set.addNewPoint(13, 3);
        // set.addNewPoint(9, 4);
        // set.addNewPoint(10, 11);
        // set.addNewPoint(21, 12);

        set = this.ps;
        
        if (set.points.length == 1) {
            return set;
        }
        
        set.sort();
        
        // Current stack that is being filled w/ Convex Hull points
        curr = new PointSet();
        curr.addPoint(set.points[0]);
        curr.addPoint(set.points[1]);
        
        for (let i = 2; i < set.points.length; i++) {
            point = set.points[i];
        
            if (curr.points.length == 1) {
                curr.addPoint(point);
            }
            else {
                while (curr.points.length > 1 && isRight(curr.points[curr.points.length-1], curr.points[curr.points.length-2], point)) {
                    curr.points.pop();
                }
                curr.addPoint(point);
            }
        }
        
        set.reverse();
        
        currBack = new PointSet();
        currBack.addPoint(set.points[0]);
        currBack.addPoint(set.points[1]);
        
        for (let i = 2; i < set.points.length; i++) {
            point = set.points[i];
        
            if (currBack.points.length == 1) {
                currBack.addPoint(point);
            }
            else {
                while (currBack.points.length > 1 && isRight(currBack.points[currBack.points.length-1], currBack.points[currBack.points.length-2], point)) {
                    currBack.points.pop();
                }
                currBack.addPoint(point);
            }
        }
        
        
        for (let i = 1; i < currBack.points.length; i++) {
            curr.points.push(currBack.points[i]);
        }
        
        // console.log("Test:" + curr.toString());
        return curr;
        
	
    }
}

// Uses cross multiplication to determine if third point is to the right
function isRight(a, b, c) {
    return ((b.x - a.x)*(c.y - a.y) - (b.y - a.y)*(c.x - a.x)) <= 0;
}

try {
exports.PointSet = PointSet;
exports.ConvexHull = ConvexHull;
} catch (e) {
console.log("not running in Node");
}