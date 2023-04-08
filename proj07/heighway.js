const SVG_NS = "http://www.w3.org/2000/svg";

let MAX_DEPTH = 1;

const svg_div = document.querySelector("#svg-div");
let svg = document.querySelector("#canvas");
let heighwayGroup = document.querySelector("#heighway-group");

let start = function () {
  // Set the max depth to the number of iterations set by the user.
  let depth = document.getElementById("iterations").value;
  MAX_DEPTH = depth;

  // If a canvas already exists...
  if (svg_div.children.length != 0) {
    // Replace the svg with an empty one.
    let svg = document.querySelector("#canvas");
    let emptySvg = createNewSVG();
    svg_div.removeChild(svg);
    svg_div.appendChild(emptySvg);
  }

  // Set instance vars.
  svg = document.querySelector("#canvas");
  heighwayGroup = document.querySelector("#heighway-group");

  // Draw the dragon curve.
  drawIteration(150, 50, 400, 50, 0, heighwayGroup, false);
};

// Create a new clear SVG canvas.
let createNewSVG = function () {
  let newSVG = document.createElementNS(SVG_NS, "svg");
  newSVG.setAttributeNS(null, "id", "canvas");
  newSVG.setAttributeNS(null, "width", "600");
  newSVG.setAttributeNS(null, "height", "400");
  newSVG.setAttributeNS(null, "viewBox", "0 0 600 400");

  let rect = document.createElementNS(SVG_NS, "rect");
  rect.setAttributeNS(null, "width", "600");
  rect.setAttributeNS(null, "height", "400");
  rect.setAttributeNS(null, "stroke", "black");
  rect.setAttributeNS(null, "stroke-width", "2");
  rect.setAttributeNS(null, "fill", "white");

  let group = document.createElementNS(SVG_NS, "g");
  group.setAttributeNS(null, "id", "heighway-group");
  group.setAttributeNS(null, "transform", "matrix(1, 0, 0, -1, 0, 300)");

  newSVG.appendChild(rect);
  newSVG.appendChild(group);

  return newSVG;
};

// Draw a basic line segment.
let makeBasicSegment = function () {
  let basicLine = document.createElementNS(SVG_NS, "line");
  basicLine.setAttributeNS(null, "x1", "0");
  basicLine.setAttributeNS(null, "y1", "0");
  basicLine.setAttributeNS(null, "x2", "600");
  basicLine.setAttributeNS(null, "y2", "0");
  basicLine.setAttributeNS(null, "stroke", "rgba(0, 0, 0, 0)");
  basicLine.setAttributeNS(null, "stroke-width", MAX_DEPTH * 3);
  //   let segment = document.createElementNS(SVG_NS, "polygon");
  //   segment.setAttributeNS(null, "id", "koch-basic");
  //   segment.setAttributeNS(null, "points", "0 0 200 0 300 173 400 0 600 0");
  //   segment.setAttributeNS(null, "fill", "black");
  //   segment.setAttributeNS(null, "stroke", "black");
  //   segment.setAttributeNS(null, "stroke-width", "1");
  return basicLine;
};

// Get a transformation matrix for an iteration.
// (a, b) = (1, 0) unit vector (displacement in (x1, y1), (x2, y2) scaled by 600 (length of segment))
// (c, d) = (0, 1) unit vector (same scaling of displacement)
// (e, f) = (0, 0) origin translation (where coordinates are in space)
let getTransformMatrix = function (x1, y1, x2, y2) {
  let a = (x2 - x1) / 600;
  let b = (y2 - y1) / 600;
  let c = -b;
  let d = a;
  let e = x1;
  let f = y1;

  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
};

// Draw a Heighway dragon recursively.
let drawIteration = function (x1, y1, x2, y2, depth, parentGroup, direction) {
  // If you're at the max number of iterations, get out of there!
  if (depth > MAX_DEPTH) {
    return;
  }

  // Create a group for this segment of the iteration
  let curGroup = document.createElementNS(SVG_NS, "g");

  // Transform it according to where the (x1, y1), (x2, y2) coordinates are.
  curGroup.setAttributeNS(
    null,
    "transform",
    getTransformMatrix(x1, y1, x2, y2)
  );

  // Append to last iteration's group.
  parentGroup.appendChild(curGroup);

  // Add a segment for this iteration.
  let segment = makeBasicSegment();

  // Determine whether the triangle should point up or down based on the given direction.
  if (direction) {
    segment.setAttributeNS(null, "id", "left");
  } else {
    segment.setAttributeNS(null, "id", "right");
  }

  // Append line svg to this group.
  curGroup.appendChild(segment);

  // If you're at the max number of iterations:
  if (depth == MAX_DEPTH) {
    // Set the line color to red instead of transparent!
    segment.setAttributeNS(null, "stroke", "rgb(143, 44, 44)");
  }

  // Iterate recursively with an upside down triangle if caller's direction was true or a triangle if it was false.
  // The left side of the recursive call will take in a direction of "false",
  // while the right side will take in a direction of "true" to continue the "zigzag effect".
  if (direction) {
    drawIteration(0, 0, 300, -300, depth + 1, curGroup, false);
    drawIteration(300, -300, 600, 0, depth + 1, curGroup, true);
  } else {
    drawIteration(0, 0, 300, 300, depth + 1, curGroup, false);
    drawIteration(300, 300, 600, 0, depth + 1, curGroup, true);
  }
};

// Draw initial canvas.
svg_div.appendChild(createNewSVG());
