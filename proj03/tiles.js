// Draw tiles on page load
window.onload = () => {
  drawTiles(10, 10);
  clickFirst();
  clickLast();
};

// Generate three random colors
let r1 = Math.random() * 255;
let g1 = Math.random() * 255;
let b1 = Math.random() * 255;

let r2 = Math.random() * 255;
let g2 = Math.random() * 255;
let b2 = Math.random() * 255;

// Draw tiles with color values between rgb1 and rgb2 to the screen
function drawTiles(n, m) {
  // Select parent div
  const tileBox = document.querySelector("#tile-box");

  // Calculate change needed
  let rstep = (r2 - r1) / (n * m);
  let gstep = (g2 - g1) / (n * m);
  let bstep = (b2 - b1) / (n * m);

  // Double for loop for drawing tiles to screen
  for (let i = 1; i <= n; i++) {
    for (let i = 1; i <= m; i++) {
      // Create a .tile div
      let tile = document.createElement("div");
      tile.textContent = "";
      tile.classList.add("tile");

      // Update rgb values based on step
      r1 = r1 + rstep;
      g1 = g1 + gstep;
      b1 = b1 + bstep;

      // Style div
      tile.style.backgroundColor = "rgb(" + r1 + ", " + g1 + ", " + b1 + ")";

      // Add to parent
      tileBox.appendChild(tile);
    }
  }
}

// These methods only work once - why?
// And how to get this to work for all tiles?
// How to only change the base color of the tile that's clicked, and not regenerate the other base?

function clickFirst() {
  // Get the first tile
  var element = document.querySelector(".tile");
  element.onclick = function () {
    // Regenerate rgb values
    r1 = Math.random() * 255;
    g1 = Math.random() * 255;
    b1 = Math.random() * 255;

    // Redraw tiles
    removeTiles();
    drawTiles(10, 10);
  };
}

function clickLast() {
  // Get the last tile
  var element = document.querySelector(".tile:last-child");
  element.onclick = function () {
    // Regenerate rgb values
    r2 = Math.random() * 255;
    g2 = Math.random() * 255;
    b2 = Math.random() * 255;

    // Redraw tiles
    removeTiles();
    drawTiles(10, 10);
  };
}

// Remove all tiles from the screen
function removeTiles() {
  const elements = document.getElementsByClassName("tile");
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}
