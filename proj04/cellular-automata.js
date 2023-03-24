/**
 * Draws a space-time diagram using the rule provided.
 * @param {Number} num: rule number, 0-255 in decimal.
 * @param {Number} iterations: number of rows to run through.
 * */

function drawSTDiagram(num, iterations) {
  // Draw rule.
  drawRule(num);

  // Select main body to draw in.
  const cellBody = document.querySelector("#cell-body");

  // Append a header.
  let header = document.createElement("h2");
  header.textContent = "Here's the ST Diagram!";
  cellBody.appendChild(header);

  // Draw the original configuration in row 0.
  let config = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  drawTiles(config, 0);

  // For the number of iterations, apply the rule and draw the new configuration.
  // Then update the configuration variable.
  for (let i = 1; i <= iterations; i++) {
    let newConfig = applyRule(config, num);
    drawTiles(newConfig, i);
    config = newConfig;
  }
}

/**
 * Draws the binary representation of the corresponding rule.
 * @param {Number} num: number, 0-255 in decimal.
 */

function drawRule(num) {
  // Convert number to binary array.
  const rule = convertToBinaryArray(num);

  // Parent div.
  const tileBox = document.querySelector("#cell-body");

  // Create and append header.
  let header = document.createElement("h2");
  header.textContent = "Here's the rule!";
  tileBox.appendChild(header);

  // ******* TO BE FIXED: Create overarching rule parent div.
  let row = document.createElement("div");
  row.classList.add("rule");
  tileBox.appendChild(row);

  for (let i = 0; i < rule.length; i++) {
    // Create a .cell div
    let cell = document.createElement("div");
    cell.textContent = "" + Math.pow(2, i);
    cell.classList.add("cell");

    // Style div based on whether it's a 0 or 1
    if (rule[i] == 0) {
      cell.style.backgroundColor = "white";
    } else {
      cell.style.backgroundColor = "black";
    }

    // Add to parent.
    row.appendChild(cell);
  }
}

/**
 * Draws tiles of a given binary array to the DOM.
 * @param {array} bArray: array containing 0s and 1s to be drawn.
 * @param {Number} rowNum: grid row number to add to div.
 */

function drawTiles(bArray, rowNum) {
  // Find parent.
  const tileBox = document.querySelector("#cell-body");

  // Make a row div parent.
  let row = document.createElement("div");
  row.classList.add("row");
  row.style.gridRow = rowNum;
  tileBox.appendChild(row);

  // Iterate through the binary array.
  for (let i = 0; i < bArray.length; i++) {
    // Create a .cell div
    let cell = document.createElement("div");
    cell.textContent = "";
    cell.classList.add("cell");

    // Style div based on whether it's a 0 or 1
    if (bArray[i] == 0) {
      cell.style.backgroundColor = "white";
    } else {
      cell.style.backgroundColor = "black";
    }

    // Add to parent
    row.appendChild(cell);
  }
}

/**
 * Takes any number and converts it to an array of 0s and 1s corresponding to its representation in binary.
 * @param {Number} number: to be converted.
 * @returns {array} the number converted to binary, padded with 0s to fill 1 byte.
 */

function convertToBinaryArray(number) {
  // Convert to binary string
  const str = Math.abs(number).toString(2);

  // Initially empty
  let bArray = [];

  // Find remainder
  let mod = str.length % 8;

  // Pad necessary 0s to top if necessary
  if (mod != 0) {
    for (let i = 0; i < 8 - mod; i++) {
      bArray.push(0);
    }
  }

  // Load string into a binary array
  for (let i = 0; i < str.length; i++) {
    bArray.push(Number(str.charAt(i)));
  }

  // Order by least significant bit to most significant bit.
  bArray = bArray.reverse();
  return bArray;
}

/**
 * Returns the ruleset corresponding with a binary array.
 * @param {array} bArray: array of 0s and 1s.
 * @returns a corresponding ruleset.
 */

// ******* Can be pared down/eliminated?

function defineRule(bArray) {
  // Initially empty array.
  let ruleset = [];

  for (let i = 0; i < bArray.length; i++) {
    if (bArray[i] == 1) {
      ruleset[i] = 1;
    } else {
      ruleset[i] = 0;
    }
    // console.log(key, ruleset[key]);
  }

  // console.log("in definerule" + ruleset);
  return ruleset;
}

/**
 * Apply a cellular automata rule to a configuration.
 * @param {array} config: initial configuration of 0s and 1s.
 * @param {Number} rule: rule in decimal to be applied.
 * @returns {array} new configuration after rule applied.
 */

function applyRule(config, rule) {
  // Use helper methods to get rule.
  const bArray = convertToBinaryArray(rule);
  const ruleset = defineRule(bArray);

  // Initially empty return value.
  let newConfig = [];

  // Iterate through configuration.
  // Start at 1 and end at .length to avoid issues with -1.
  for (let i = 1; i <= config.length; i++) {
    // Define three cells.
    leftNeighbor = config[i - 1];
    self = config[i % config.length];
    rightNeighbor = config[(i + 1) % config.length];

    // Find update based on what the cells are.
    const str = "" + leftNeighbor + self + rightNeighbor;
    let bin = parseInt(str, 2);
    let update = ruleset[bin];

    // Compensate for the fact that your last cell looked at will actually have the center cell at index 0.
    if (i == config.length) {
      // Push at start.
      newConfig.unshift(update);
    } else {
      // Push at end.
      newConfig.push(update);
    }
  }

  return newConfig;
}

module.exports = { applyRule };
