const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

const SVG_ELEM = document.querySelector("#convex-hull-box");

const convexHullViewer = new ConvexHullViewer(SVG_ELEM, new PointSet());

SVG_ELEM.addEventListener("click", convexHullViewer.addPoint);

// An object that represents a 2-d point, consisting of an
// x-coordinate and a y-coordinate. The `compareTo` function
// implements a comparison for sorting with respect to x-coordinates,
// breaking ties by y-coordinate.
function Point(x, y, id) {
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
  };

  // return a string representation of this Point
  this.toString = function () {
    return "(" + x + ", " + y + ")";
  };
}

// An object that represents a set of Points in the plane. The `sort`
// function sorts the points according to the `Point.compareTo`
// function. The `reverse` function reverses the order of the
// points. The functions getXCoords and getYCoords return arrays
// containing x-coordinates and y-coordinates (respectively) of the
// points in the PointSet.
function PointSet() {
  this.points = [];
  this.curPointID = 0;

  // create a new Point with coordintes (x, y) and add it to this
  // PointSet
  this.addNewPoint = function (x, y) {
    console.log("hello?");
    this.points.push(new Point(x, y, this.curPointID));
    this.curPointID++;
  };

  // add an existing point to this PointSet
  this.addPoint = function (pt) {
    this.points.push(pt);
  };

  // sort the points in this.points
  this.sort = function () {
    this.points.sort((a, b) => {
      return a.compareTo(b);
    });
  };

  // reverse the order of the points in this.points
  this.reverse = function () {
    this.points.reverse();
  };

  // return an array of the x-coordinates of points in this.points
  this.getXCoords = function () {
    let coords = [];
    for (let pt of this.points) {
      coords.push(pt.x);
    }

    return coords;
  };

  // return an array of the y-coordinates of points in this.points
  this.getYCoords = function () {
    let coords = [];
    for (pt of this.points) {
      coords.push(pt.y);
    }

    return coords;
  };

  // get the number of points
  this.size = function () {
    return this.points.length;
  };

  // return a string representation of this PointSet
  this.toString = function () {
    let str = "[";
    for (let pt of this.points) {
      str += pt + ", ";
    }
    str = str.slice(0, -2); // remove the trailing ', '
    str += "]";

    return str;
  };
}

function ConvexHullViewer(svg, ps) {
  this.svg = svg; // a svg object where the visualization is drawn
  this.ps = ps; // a point set of the points to be visualized
  this.elements = [];
  this.highlighted = [];
  this.muted = [];

  // Listen to clicks and add new points to point set
  this.addPoint = function (e) {
    console.log("got here, point set", ps);
    let rect = SVG_ELEM.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    ps.addNewPoint(x, y);

    convexHullViewer.draw();
  };

  // Draws a point.
  this.draw = function () {
    // The current point to draw is the one that was just added (one before the current id)
    let curPoint = ps.points[ps.curPointID - 1];

    let curPointX = curPoint.x;
    let curPointY = curPoint.y;

    // Create a new .point circle element with center x and y
    let dot = document.createElementNS(SVG_NS, "circle");
    dot.setAttributeNS(null, "cx", curPointX);
    dot.setAttributeNS(null, "cy", curPointY);
    dot.classList.add("point");
    dot.id = curPoint.id;

    // Add event listener for highlighting
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      this.highlight(dot.id);
    });

    // Append to elements list and svg
    this.elements[dot.id] = dot;
    SVG_ELEM.appendChild(dot);
  };

  this.highlight = function (pId) {
    // Find the svg element associated with the id
    toHighlight = this.elements[pId];

    if (this.highlighted.indexOf(toHighlight) == -1) {
      // console.log(this.highlighted.indexOf(toHighlight), "highlighting");
      // Add to highlighted list and class
      this.highlighted[pId] = toHighlight;
      toHighlight.classList.add("highlight");
    } else {
      // console.log(this.highlighted.indexOf(toHighlight), "unhighlighting");
      // Remove from highlighted list and class
      this.highlighted.splice(pId, 1);
      toHighlight.classList.remove("highlight");
    }

    // console.log(this.highlighted);
  };

  // Add edges
}

/*
 * An object representing an instance of the convex hull problem. A ConvexHull stores a PointSet ps that stores the input points, and a ConvexHullViewer viewer that displays interactions between the ConvexHull computation and the
 */
function ConvexHull(ps, viewer) {
  this.ps = ps; // a PointSet storing the input to the algorithm
  this.viewer = viewer; // a ConvexHullViewer for this visualization

  // start a visualization of the Graham scan algorithm performed on ps
  this.start = function () {
    // COMPLETE THIS METHOD
  };

  // perform a single step of the Graham scan algorithm performed on ps
  this.step = function () {
    // COMPLETE THIS METHOD
  };

  // Return a new PointSet consisting of the points along the convex
  // hull of ps. This method should **not** perform any
  // visualization. It should **only** return the convex hull of ps
  // represented as a (new) PointSet. Specifically, the elements in
  // the returned PointSet should be the vertices of the convex hull
  // in clockwise order, starting from the left-most point, breaking
  // ties by minimum y-value.
  this.getConvexHull = function () {
    // COMPLETE THIS METHOD
  };
}
