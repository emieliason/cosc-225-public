function drawSTDiagram(num, iterations) {
  const bArray = convertToBinaryArray(num);
  drawRule(bArray);

  console.log("bArray");
  console.log(bArray);

  const rule = defineRule(bArray);

  console.log("rule");
  console.log(rule);

  const cellBody = document.querySelector("#cell-body");

  let header = document.createElement("h2");
  header.textContent = "Here's the ST Diagram!";
  cellBody.appendChild(header);

  let config = [
    0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0,
  ];
  drawTiles(config, 0);

  let newConfig = applyRule(config, rule);

  for (let i = 1; i <= iterations; i++) {
    config = newConfig;
    newConfig = applyRule(config, rule);
    drawTiles(newConfig, i);
  }
}

function drawRule(bArray) {
  const tileBox = document.querySelector("#cell-body");

  let header = document.createElement("h2");
  header.textContent = "Here's the rule!";
  tileBox.appendChild(header);

  drawTiles(bArray, 0);
}

function drawTiles(bArray, rowNum) {
  const tileBox = document.querySelector("#cell-body");

  let row = document.createElement("div");
  row.classList.add("row");
  row.style.gridRow = rowNum;
  tileBox.appendChild(row);

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

function convertToBinaryArray(number) {
  // Convert to binary string
  const str = Math.abs(number).toString(2);
  let bArray = [];

  // Find remainder
  let mod = str.length % 8;

  // Pad necessary 0s to top
  if (mod != 0) {
    for (let i = 0; i < 8 - mod; i++) {
      bArray.push(0);
    }
  }

  // Load string into a binary array
  for (let i = 0; i < str.length; i++) {
    bArray.push(Number(str.charAt(i)));
  }

  console.log(bArray);
  return bArray;
}

function defineRule(bArray) {
  let ruleset = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
  };

  for (var key in ruleset) {
    if (bArray[key] == 1) {
      ruleset[key] = 1;
    }
    // console.log(key, ruleset[key]);
  }

  return ruleset;
}

function applyRule(config, rule) {
  let newConfig = [];
  for (let i = 1; i <= config.length; i++) {
    leftNeighbor = config[i - 1];
    self = config[i % config.length];
    rightNeighbor = config[(i + 1) % config.length];

    const str = "" + leftNeighbor + self + rightNeighbor;
    //console.log("string: " + str);

    let bin = parseInt(str, 2);
    // console.log("decimal: " + bin);

    const update = rule[bin];
    // console.log("update: " + update);

    if (i == config.length) {
      newConfig.unshift(update);
    } else {
      newConfig.push(update);
    }
  }

  console.log("newconfig", newConfig);
  return newConfig;
}

module.exports = { applyRule };
