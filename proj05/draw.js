const ns = "http://www.w3.org/2000/svg";

let color = "rgb(128, 128, 128)";

window.onload = () => {
  createColorPicker();
};

const main = document.querySelector("#main-body");
const canvas = document.querySelector("#canvas");
const rect = canvas.getBoundingClientRect();

canvas.addEventListener("click", anchorLine);
canvas.addEventListener("mousemove", dragLine);

let isDrawing = false;

let x1 = 0,
  y1 = 0,
  x2 = 200,
  y2 = 200;

const newLine = document.createElementNS(ns, "line");

function anchorLine(e) {
  isDrawing = !isDrawing;

  if (isDrawing) {
    x1 = e.clientX - rect.left;
    y1 = e.clientY - rect.top;
    newLine.setAttributeNS(null, "x1", x1);
    newLine.setAttributeNS(null, "y1", y1);
    newLine.setAttributeNS(null, "x2", x1);
    newLine.setAttributeNS(null, "y2", y1);

    newLine.setAttributeNS(null, "stroke", color);
    canvas.appendChild(newLine);
  } else {
    const clone = newLine.cloneNode(true);
    canvas.appendChild(clone);
  }
}

function dragLine(e) {
  if (isDrawing) {
    x2 = e.clientX - rect.left;
    y2 = e.clientY - rect.top;
    newLine.setAttributeNS(null, "x2", x2);
    newLine.setAttributeNS(null, "y2", y2);
  }
}

function createColorPicker() {
  const colorPicker = document.createElement("div");
  colorPicker.id = "color-picker";
  main.appendChild(colorPicker);

  const colorBox = document.createElement("div");
  colorBox.id = "color-box";
  colorPicker.appendChild(colorBox);

  const colorInputs = document.createElement("div");
  colorInputs.id = "color-inputs";
  colorPicker.appendChild(colorInputs);

  rgb = ["red", "green", "blue"];
  rgbInputs = [];
  rgbOutputs = [];

  for (let i = 0; i < rgb.length; i++) {
    const bounding = document.createElement("div");

    const label = document.createElement("label");
    label.setAttribute("for", rgb[i] + "Val");
    label.innerHTML = rgb[i] + ": ";

    bounding.appendChild(label);
    const input = document.createElement("input");
    input.defaultValue = 128;
    Object.assign(input, {
      type: "range",
      name: rgb[i],
      id: rgb[i],
      min: 0,
      max: 255,
      step: "1",
      value: "128",
    });

    rgbInputs.push(input);

    bounding.appendChild(input);

    const output = document.createElement("output");
    output.innerHTML = "128";
    output.setAttribute("for", rgb[i] + "Val");
    Object.assign(output, {
      className: "red-output",
    });

    rgbOutputs.push(output);

    bounding.appendChild(output);

    colorInputs.appendChild(bounding);
  }

  for (let i = 0; i < rgbInputs.length; i++) {
    rgbInputs[i].addEventListener("input", function () {
      rgbOutputs[i].textContent = rgbInputs[i].value;
      color =
        "rgb(" +
        rgbInputs[0].value +
        "," +
        rgbInputs[1].value +
        "," +
        rgbInputs[2].value +
        ")";
      colorBox.style.backgroundColor = color;
    });
  }
}
