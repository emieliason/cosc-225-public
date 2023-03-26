const SVG_NS = "http://www.w3.org/2000/svg";

function Graph(id) {
    this.id = id;
    this.vertices = [];
    this.edges = [];
    this.vis = null;
    this.nextVertexID = 0;
    this.nextEdgeID = 0;
    
    this.highVertices = [];

    this.setVisualizer = function (vis) {
	this.vis = vis;
    }

    this.createVertex = function (x, y) {
	const vtx = new Vertex(this.nextVertexID, this, x, y);
	this.nextVertexID++;
	return vtx;
    }

    this.createEdge = function (vtx1, vtx2) {
	const edge = new Edge(vtx1, vtx2, this.nextEdgeID);
	this.nextEdgeID++;
	return edge;
    }

    this.addVertex = function(vtx) {
	if (!this.vertices.includes(vtx)) {
	    this.vertices.push(vtx);
	    this.vis.addVertex(vtx);
	    console.log("added vertex with id " + vtx.id);
	} else {
	    console.log("vertex with id " + vtx.id + " not added because it is already a vertex in the graph.");
	}
    }

    this.addEdge = function(vtx1, vtx2) {
	if (!this.isEdge(vtx1, vtx2)) {
	    const edge = new Edge(vtx1, vtx2)
	    vtx1.addNeighbor(vtx2);
	    vtx2.addNeighbor(vtx1);
	    this.edges.push(edge);
	    this.vis.addEdge(edge);
	    console.log("added edge (" + vtx1.id + ", " + vtx2.id + ")");
	} else {
	    console.log("edge (" + vtx1.id + ", " + vtx2.id + ") not added because it is already in the graph");
	}
    }

    this.isEdge = function (vtx1, vtx2) {
	for(const edge of this.edges) {
	    if (edge.equals(vtx1, vtx2)) {
		return true;
	    }
	}	
	return false;
    }

    this.adjacencyLists = function () {
	let str = '';
	for (const vtx of this.vertices) {
	    str += vtx.id + ':';
	    for (const nbr of vtx.neighbors) {
		str += (' ' + nbr.id);
	    }
	    str += '<br>';
	}
	return str;
    }

    this.clickVertex = function (vtx) {
	console.log("You clicked vertex " + vtx.id);
	this.highlight(vtx);
    }

    this.highlight = function (vtx) {
	const index = this.highVertices.indexOf(vtx);
	if (index == -1) {
	    this.highVertices.push(vtx);
	    this.vis.highlightVertex(vtx);
	} else {
	    this.highVertices.splice(index, 1);
	    this.vis.unhighlightVertex(vtx);
	}

	if (this.highVertices.length == 2) {
	    this.addEdge(this.highVertices[0], this.highVertices[1]);
	    this.vis.unhighlightVertex(this.highVertices[0]);
	    this.vis.unhighlightVertex(this.highVertices[1]);
	    this.highVertices = [];
	}
    }
}

function Vertex(id, graph, x, y) {
    this.id = id;
    this.graph = graph;
    this.x = x;
    this.y = y;
    
    this.neighbors = [];
    this.addNeighbor = function (vtx) {
	if (!this.neighbors.includes(vtx)) {
	    this.neighbors.push(vtx);
	}
    }

    this.removeNeighbor = function (vtx) {
	const index = this.neighbors.indexOf(vtx);
	if (index != -1) {
	    this.neighbors.splice(index, 1);
	}
    }

    this.hasNeighbor = function (vtx) {
	return this.neighbors.includes(vtx);
    }
}

function Edge (vtx1, vtx2, id) {
    this.vtx1 = vtx1;
    this.vtx2 = vtx2;
    this.id = id;

    this.equals = function (vtx1, vtx2) {
	return (this.vtx1 == vtx1 && this.vtx2 == vtx2) || (this.vtx1 == vtx2 && this.vtx2 == vtx1);
    }
}

function GraphVisualizer (graph, svg, text) {
    this.graph = graph;
    this.svg = svg;
    this.text = text;

    // create svg group for displaying edges
    this.edgeGroup = document.createElementNS(SVG_NS, "g");
    this.edgeGroup.id = "graph-" + graph.id + "-edges";
    this.svg.appendChild(this.edgeGroup);

    // create svg group for displaying vertices
    this.vertexGroup = document.createElementNS(SVG_NS, "g");
    this.vertexGroup.id = "graph-" + graph.id + "-vertices";
    this.svg.appendChild(this.vertexGroup);

    this.vertexElts = [];
    this.edgeElts = [];

    this.createVertex = function (e) {
	const rect = this.svg.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	const vtx = graph.createVertex(x, y);
	this.graph.addVertex(vtx);
    }

    this.addVertex = function (vtx, onClick) {
	const elt = document.createElementNS(SVG_NS, "circle");
	elt.classList.add("vertex");
	elt.setAttributeNS(null, "cx", vtx.x);
	elt.setAttributeNS(null, "cy", vtx.y);

	elt.addEventListener("click", (e) => {
	    e.stopPropagation();
	    this.graph.clickVertex(vtx);
	});

	this.vertexGroup.appendChild(elt);
	this.vertexElts[vtx.id] = elt;
	this.updateTextBox();
    }

    this.addEdge = function (edge) {
	const vtx1 = edge.vtx1;
	const vtx2 = edge.vtx2;
	const edgeElt = document.createElementNS(SVG_NS, "line");
	edgeElt.setAttributeNS(null, "x1", vtx1.x);
	edgeElt.setAttributeNS(null, "y1", vtx1.y);
	edgeElt.setAttributeNS(null, "x2", vtx2.x);
	edgeElt.setAttributeNS(null, "y2", vtx2.y);
	edgeElt.classList.add("edge");
	this.edgeElts[edge.id] = edgeElt;
	this.edgeGroup.appendChild(edgeElt);
	this.updateTextBox();
    }

    this.updateTextBox = function () {
	this.text.innerHTML = this.graph.adjacencyLists();
    }

    this.highlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.add("highlight");
    }

    this.unhighlightVertex = function (vtx) {
	const elt = this.vertexElts[vtx.id];
	elt.classList.remove("highlight");	
    }

    this.svg.addEventListener("click", (e) => {
	this.createVertex(e);
    });
}

// function drawDot(e) {
//     let rect = box.getBoundingClientRect();
//     let x = e.clientpX - rect.left;
//     let y = e.clientY - rect.top;
//     // console.log("Clicked: " + x + ", " + y);
//     let dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
//     dot.setAttributeNS(null, "cx", x);
//     dot.setAttributeNS(null, "cy", y);
//     dot.classList.add("dot");
//     box.appendChild(dot);
    
// }

// let g = new Graph(null);
// let u = new Vertex(0, 0, 0, g, null);
// let v = new Vertex(1, 0, 0, g, null);
// let w = new Vertex(2, 0, 0, g, null);

// g.addVertex(u);
// g.addVertex(v);
// g.addVertex(w);

