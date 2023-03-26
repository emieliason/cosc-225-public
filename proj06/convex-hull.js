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
  this.pointElements = [];
  this.edgeElements = [];
  this.highlighted = [];
  this.edges = [];
  this.muted = [];

  // this.svg.addEventListener("click", this.addPoint);

  this.edgeGroup = document.createElementNS(SVG_NS, "g");
  this.svg.appendChild(this.edgeGroup);

  this.pointGroup = document.createElementNS(SVG_NS, "g");
  this.svg.appendChild(this.pointGroup);

  // Listen to clicks and add new points to point set
  this.addPoint = function (e) {
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
      this.clickVertex(dot.id);
    });

    // Append to elements list and svg
    this.pointElements[dot.id] = dot;
    this.svg.appendChild(dot);
    this.pointGroup.appendChild(dot);

    console.log(this.ps);
  };

  this.clickVertex = function (pId) {
    // Retrieve the svg element associated with the id
    elem = this.pointElements[pId];
    index = this.highlighted.indexOf(pId);

    if (index == -1) {
      // Add to highlighted list and class
      this.highlight(pId);
    } else {
      // Remove from highlighted list and class
      this.unhighlight(pId);
    }
  };

  this.mute = function (pId) {
    // Add to muted list
    this.muted.push(pId);

    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];

    // Add mute class to the element
    point.classList.add("mute");

    console.log("muted", this.muted);
  };

  this.unmute = function (pId) {
    console.log("made it");
    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];
    index = this.muted.indexOf(pId);
    console.log("unhighlight point", index);

    // Remove from highlighted list
    this.muted.splice(index, 1);

    // Remove highlighted class from element
    point.classList.remove("mute");
  };

  this.highlight = function (pId) {
    // Add to highlighted list
    this.highlighted.push(pId);

    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];

    // Add highlighted class to the element
    point.classList.add("highlight");

    // If two elements have been highlighted
    if (this.highlighted.length == 2) {
      // Add an edge between them
      this.addEdge(this.highlighted[0], this.highlighted[1]);

      // Unhighlight both elements
      this.unhighlight(this.highlighted[0]);
      this.unhighlight(this.highlighted[0]);
      this.highlighted = [];
    }
  };

  // Unhighlight point associated with pId
  this.unhighlight = function (pId) {
    console.log("id", pId);
    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];
    index = this.highlighted.indexOf(pId);
    console.log("unhighlight point", index);

    // Remove from highlighted list
    this.highlighted.splice(index, 1);

    // Remove highlighted class from element
    point.classList.remove("highlight");
  };

  // Add edge
  this.addEdge = function (pId1, pId2) {
    // Retrieve the svg elements associated with the ids
    point1 = this.pointElements[pId1];
    point2 = this.pointElements[pId2];
    console.log(point1, point2);

    // If the edge already exists, remove it
    if (
      this.edges.indexOf(pId1 + ", " + pId2) != -1 ||
      this.edges.indexOf(pId2 + ", " + pId1) != -1
    ) {
      this.removeEdge(pId1, pId2);
    } else {
      // Create element using cx and cy coordinates from svg elements
      const edgeElt = document.createElementNS(SVG_NS, "line");
      edgeElt.setAttributeNS(null, "x1", point1.getAttribute("cx"));
      edgeElt.setAttributeNS(null, "y1", point1.getAttribute("cy"));
      edgeElt.setAttributeNS(null, "x2", point2.getAttribute("cx"));
      edgeElt.setAttributeNS(null, "y2", point2.getAttribute("cy"));
      edgeElt.classList.add("edge");
      edgeElt.id = pId1 + "-" + pId2;

      // Add to edges list
      this.edges.push(pId1 + ", " + pId2);
      this.edgeElements[edgeElt.id] = edgeElt;
      console.log(this.edgeElements);

      // Append to svg and svg group
      this.svg.appendChild(edgeElt);
      this.edgeGroup.appendChild(edgeElt);
    }
  };

  this.removeEdge = function (pId1, pId2) {
    edge = this.edgeElements[pId1 + "-" + pId2];
    index = this.edges.indexOf(pId1 + ", " + pId2);

    if (edge == undefined) {
      edge = this.edgeElements[pId2 + "-" + pId1];
      index = this.edges.indexOf(pId2 + ", " + pId1);
    }

    console.log("edge", edge);

    this.edgeGroup.removeChild(edge);
    this.edges.splice(index, 1);
  };
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
    //  highlight first element
    // highlight 2nd element in stack, creating edge
    // while element is not in hull
    // remove edge with last element
    // mute popped element
    // create new edge with new top of stack
    //
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
