const SVG_NS = "http://www.w3.org/2000/svg";

const MAX_DEPTH = 4;

const svg = document.querySelector("#canvas");
const heighwayGroup = document.querySelector("#heighway-group");
const defs = document.querySelector("#heighway-defs");

// const basicLine = document.createElementNS(SVG_NS, "line");
// basicLine.setAttributeNS(null, "x1", "0");
// basicLine.setAttributeNS(null, "y1", "0");
// basicLine.setAttributeNS(null, "x2", "600");
// basicLine.setAttributeNS(null, "y2", "0");
// basicLine.setAttributeNS(null, "stroke", "black");
// basicLine.setAttributeNS(null, "stroke-width", "2");
// defs.appendChild(basicLine);

let makeBasicSegment = function () {
  let basicLine = document.createElementNS(SVG_NS, "line");
  basicLine.setAttributeNS(null, "x1", "0");
  basicLine.setAttributeNS(null, "y1", "0");
  basicLine.setAttributeNS(null, "x2", "600");
  basicLine.setAttributeNS(null, "y2", "0");
  basicLine.setAttributeNS(null, "stroke", "black");
  basicLine.setAttributeNS(null, "stroke-width", "5");
  //   let segment = document.createElementNS(SVG_NS, "polygon");
  //   segment.setAttributeNS(null, "id", "koch-basic");
  //   segment.setAttributeNS(null, "points", "0 0 200 0 300 173 400 0 600 0");
  //   segment.setAttributeNS(null, "fill", "black");
  //   segment.setAttributeNS(null, "stroke", "black");
  //   segment.setAttributeNS(null, "stroke-width", "1");
  return basicLine;
};

let getTransformMatrixLeft = function (x1, y1, x2, y2) {
  let a = (x2 - x1) / 600;
  let b = (y2 - y1) / 600;
  let c = -b;
  let d = a;
  let e = x1;
  let f = y1;

  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
};

let getTransformMatrixRight = function (x1, y1, x2, y2) {
  let a = (x2 - x1) / 600;
  let b = (y2 - y1) / 600;
  let c = -b;
  let d = -a;
  let e = x1;
  let f = y1;

  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
};

let drawIteration = function (x1, y1, x2, y2, depth, parentGroup, direction) {
  // If you're at the max number of iterations, get out of there!
  if (depth > MAX_DEPTH) {
    return;
  }

  // Create a group for this segment of the iteration
  let curGroup = document.createElementNS(SVG_NS, "g");
  let matrix = "";

  //   if (direction) {
  //     matrix = getTransformMatrixLeft(x1, y1, x2, y2);
  //   } else {
  //     matrix = getTransformMatrixRight(x1, y1, x2, y2);
  //   }

  curGroup.setAttributeNS(
    null,
    "transform",
    getTransformMatrixLeft(x1, y1, x2, y2)
  );

  console.log("parentgroup", parentGroup);
  parentGroup.appendChild(curGroup);

  // add a segment for this iteration
  let segment = makeBasicSegment();
  if (direction) {
    segment.setAttributeNS(null, "id", "left");
  } else {
    segment.setAttributeNS(null, "id", "right");
  }
  curGroup.appendChild(segment);

  // If you're at the max number of iterations, get out of there!
  if (depth == MAX_DEPTH) {
    console.log("got to max depth");
    segment.setAttributeNS(null, "stroke", "red");
  }

  //   drawIteration(0, 0, 300, 300, depth + 1, curGroup, true);
  //   drawIteration(300, 300, 600, 0, depth + 1, curGroup, false);

  if (direction) {
    drawIteration(0, 0, 300, -300, depth + 1, curGroup, false);
    drawIteration(300, -300, 600, 0, depth + 1, curGroup, true);
  } else {
    drawIteration(0, 0, 300, 300, depth + 1, curGroup, false);
    drawIteration(300, 300, 600, 0, depth + 1, curGroup, true);
  }

  //   drawIteration(0, 0, 200, 0, depth + 1, curGroup);
  //   drawIteration(200, 0, 300, 173, depth + 1, curGroup);
  //   drawIteration(300, 173, 400, 0, depth + 1, curGroup);
  //   drawIteration(400, 0, 600, 0, depth + 1, curGroup);
};

drawIteration(100, 100, 400, 100, 0, heighwayGroup);
