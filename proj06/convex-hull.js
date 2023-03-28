const SVG_NS = "http://www.w3.org/2000/svg";
const SVG_WIDTH = 600;
const SVG_HEIGHT = 400;

// Put them all in a function, set SVG
const SVG_ELEM = document.querySelector("#convex-hull-box");

const convexHullViewer = new ConvexHullViewer(SVG_ELEM, new PointSet());
const convexHull = new ConvexHull(convexHullViewer.ps, convexHullViewer);

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
  this.edges = []; // edges, stored in format (p1, p2)

  this.pointElements = []; // svg elements for points (circles)
  this.edgeElements = []; // svg elements for edges (lines)

  this.highlighted = []; // ids of highlighted points
  this.muted = []; // ids of muted points

  // this.activeEdge;

  // this.svg.addEventListener("click", this.addPoint);

  // svg group for edges, underneath
  this.edgeGroup = document.createElementNS(SVG_NS, "g");
  this.svg.appendChild(this.edgeGroup);

  // svg group for points, in foreground
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

  // TODO: merge with addpoint function
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
      this.clickPoint(dot.id);
    });

    // Append to elements list and svg
    this.pointElements[dot.id] = dot;
    this.svg.appendChild(dot);
    this.pointGroup.appendChild(dot);

    console.log(this.ps);
  };

  // TODO: removePoint
  // this.removePoint = function (pId) {
  //   point = this.pointElements[pId];
  //   // index = this.ps

  //   // Remove element from group
  //   this.pointGroup.removeChild(point);

  //   // Remove element from list
  //   this.edges.splice(index, 1);
  // };

  // What happens when a point is clicked
  this.clickPoint = function (pId) {
    // Retrieve the svg element associated with the id
    elem = this.pointElements[pId];
    index = this.highlighted.indexOf(pId);

    if (index == -1) {
      // Add to highlighted list and class
      this.highlightPoint(pId);
    } else {
      // Remove from highlighted list and class
      this.unhighlightPoint(pId);
    }
  };

  // Mute point
  this.mute = function (pId) {
    // Add to muted list
    this.muted.push(pId);

    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];

    // Add mute class to the element
    point.classList.add("mute");
  };

  // Unmute point
  this.unmute = function (pId) {
    // Retrieve the svg element associated with the id
    point = this.pointElements[pId];
    index = this.muted.indexOf(pId);

    // Remove from highlighted list
    this.muted.splice(index, 1);

    // Remove highlighted class from element
    point.classList.remove("mute");
  };

  this.highlightPoint = function (pId) {
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
      this.unhighlightPoint(this.highlighted[0]);
      this.unhighlightPoint(this.highlighted[0]);
      this.highlighted = [];
    }
  };

  // Unhighlight point associated with pId
  this.unhighlightPoint = function (pId) {
    console.log("unhighlighting point with id", pId);
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
      //   this.removeEdge(pId1, pId2); AHAHAHAHAHH I FOUND IT
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

  // Remove an edge
  this.removeEdge = function (pId1, pId2) {
    edge = this.edgeElements[pId1 + "-" + pId2];
    index = this.edges.indexOf(pId1 + ", " + pId2);

    // If it's in the wrong order, swap it
    if (edge == undefined) {
      edge = this.edgeElements[pId2 + "-" + pId1];
      index = this.edges.indexOf(pId2 + ", " + pId1);
    }

    // Remove element from group
    this.edgeGroup.removeChild(edge);

    // Remove element from list
    this.edges.splice(index, 1);
  };

  // TODO: Highlight edge  (should only need one)
  // TODO: Unhighlight edge

  // this.highlightEdge = function (pId) {
  //   // Add to highlighted list
  //   this.highlighted.push(pId);

  //   // Retrieve the svg element associated with the id
  //   point = this.pointElements[pId];

  //   // Add highlighted class to the element
  //   point.classList.add("highlight");

  //   // If two elements have been highlighted
  //   if (this.highlighted.length == 2) {
  //     // Add an edge between them
  //     this.addEdge(this.highlighted[0], this.highlighted[1]);

  //     // Unhighlight both elements
  //     this.unhighlightPoint(this.highlighted[0]);
  //     this.unhighlightPoint(this.highlighted[0]);
  //     this.highlighted = [];
  //   }
  // };

  // // Unhighlight point associated with pId
  // this.unhighlightEdge = function (pId) {
  //   console.log("id", pId);
  //   // Retrieve the svg element associated with the id
  //   point = this.pointElements[pId];
  //   index = this.highlighted.indexOf(pId);
  //   console.log("unhighlight point", index);

  //   // Remove from highlighted list
  //   this.highlighted.splice(index, 1);

  //   // Remove highlighted class from element
  //   point.classList.remove("highlight");
  // };

  // TODO: Create a polygon using the convex hull points once it's finished
  this.drawHull = function (hullPs) {
    console.log("hull points", hullPs);
    const polygon = document.createElementNS(SVG_NS, "polygon");
    let points = "";
    for (let i = 0; i < hullPs.size(); i++) {
      console.log("hull point", hullPs.points[i]);
      currP = hullPs.points[i];
      x = currP.x;
      y = currP.y;

      points += x + "," + y + " ";
    }

    polygon.setAttributeNS(null, "points", points);
    this.edgeGroup.appendChild(polygon);
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
    console.log("start");
    console.log("convex hull", this.getConvexHull());

    this.viewer.drawHull(this.getConvexHull());
  };

  // Idea for animation
  // set = ps.sort();
  // make a new point set to hold the convex hull points curr, and currback, initially holding the first two points
  // "proposed" edge

  // current node as the highlighter one
  // keep state of the execution

  // one step: if set still has points in it
  // pop one off, and just consider that one
  // if it's the last one, do the connection
  // if it's not, do a while loop that checks whether it's to the right or not
  // add edge once you're done
  // animate:
  // repeat "step" until set doesn't have points in it
  // set set to = ps.reverse();
  // repeat "step" until set doesn't have points in it

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

    set = this.ps;

    if (set.points.length == 1) {
      return set;
    }

    set.sort();
    console.log("THIS IS THE SET: " + set);

    // // Current stack that is being filled w/ Convex Hull points
    curr = new PointSet();
    curr.addPoint(set.points[0]);
    curr.addPoint(set.points[1]);

    // adding first two edges
    this.viewer.addEdge(set.points[0].id, set.points[1].id);

    for (let i = 2; i < set.points.length; i++) {
      // grabbing point c
      point = set.points[i];

      // if there is only one point in the stack, then add the next point
      if (curr.points.length == 1) {
        this.viewer.addEdge(curr.points[curr.points.length - 1].id, point.id);
        curr.addPoint(point);
      } else {
        while (
          // if the point is to the left, then remove prev edge + create new edge
          curr.points.length > 1 &&
          isRight(
            curr.points[curr.points.length - 1],
            curr.points[curr.points.length - 2],
            point
          )
        ) {
          this.viewer.removeEdge(
            curr.points[curr.points.length - 1].id,
            curr.points[curr.points.length - 2].id
          );
          curr.points.pop();
        }

        this.viewer.addEdge(curr.points[curr.points.length - 1].id, point.id);
        curr.addPoint(point);
      }
    }

    console.log("I AM IN THE MIDDLE HERE!!");
    set.reverse();

    currBack = new PointSet();
    currBack.addPoint(set.points[0]);
    currBack.addPoint(set.points[1]);
    console.log("currBack set ONE: " + currBack.toString());

    console.log(
      "Beginning of middle: " + set.points[0].id + "," + set.points[1].id
    );
    // adding first two edges
    this.viewer.addEdge(set.points[0].id, set.points[1].id);

    for (let i = 2; i < set.points.length; i++) {
      point = set.points[i];

      if (currBack.points.length == 1) {
        currBack.addPoint(point);
      } else {
        while (
          currBack.points.length > 1 &&
          isRight(
            currBack.points[currBack.points.length - 1],
            currBack.points[currBack.points.length - 2],
            point
          )
        ) {
          console.log("complete set: " + set.toString());
          console.log("currBack set: " + currBack.toString());
          console.log(
            "Removing Edges!! Points: " +
              currBack.points[currBack.points.length - 2].id +
              "and" +
              currBack.points[currBack.points.length - 1].id
          );

          if (
            !(
              currBack.points[currBack.points.length - 2].id ==
                set.points[0].id &&
              currBack.points[currBack.points.length - 1].id == set.points[1].id
            )
          ) {
            this.viewer.removeEdge(
              currBack.points[currBack.points.length - 2].id,
              currBack.points[currBack.points.length - 1].id
            );
          }
          currBack.points.pop();
        }

        console.log(
          "Adding Edges!! Points: " +
            currBack.points[currBack.points.length - 1].id +
            "and" +
            point.id
        );
        this.viewer.addEdge(
          currBack.points[currBack.points.length - 1].id,
          point.id
        );
        currBack.addPoint(point);
      }
    }

    for (let i = 1; i < currBack.points.length; i++) {
      curr.points.push(currBack.points[i]);
    }
    console.log("Test:" + curr.toString());

    return curr;
  };

  // Return a new PointSet consisting of the points along the convex
  // hull of ps. This method should **not** perform any
  // visualization. It should **only** return the convex hull of ps
  // represented as a (new) PointSet. Specifically, the elements in
  // the returned PointSet should be the vertices of the convex hull
  // in clockwise order, starting from the left-most point, breaking
  // ties by minimum y-value.
  this.getConvexHull = function () {
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
      } else {
        while (
          curr.points.length > 1 &&
          isRight(
            curr.points[curr.points.length - 1],
            curr.points[curr.points.length - 2],
            point
          )
        ) {
          // console.log("1POP" + curr.points.pop().id);
          curr.points.pop();
        }
        // console.log("1PUSH" + point.id);
        curr.addPoint(point);
        // console.log("pt 1 " + curr.toString());
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
      } else {
        while (
          currBack.points.length > 1 &&
          isRight(
            currBack.points[currBack.points.length - 1],
            currBack.points[currBack.points.length - 2],
            point
          )
        ) {
          // console.log("2POP" + currBack.points.pop().id);
          currBack.points.pop();
        }
        // console.log("2PUSH" + point.id);
        currBack.addPoint(point);
        // console.log("pt 2 " + currBack.toString());
      }
    }

    for (let i = 1; i < currBack.points.length; i++) {
      curr.points.push(currBack.points[i]);
    }

    console.log("Test:" + curr.toString());
    return curr;
  };
}

// Uses cross multiplication to determine if third point is to the right
function isRight(a, b, c) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) <= 0;
}

try {
  exports.PointSet = PointSet;
  exports.ConvexHull = ConvexHull;
} catch (e) {
  console.log("not running in Node");
}
