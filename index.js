let thereWasACriticalError = false;
let canvas;
let canvasWidth = 400;
let canvasHeight = 400;
let newCanvasHeight = false;
let network;
let trainingSectionIsActive = true;
let shapesSectionIsActive = false;

function setup() {
  let width = currCanvasParentElem.clientWidth;
  canvasWidthElem.innerHTML = width;
  canvasHeightElem.innerHTML = canvasHeight;
  canvas = createCanvas(width, canvasHeight);
  newCanvasHeight = false;
  canvas.parent('trainingCanvasParent');
  let numIn = parseInt(nnNumInputsElem.value);
  let numHid = parseInt(nnNumHiddenElem.value);
  let numOut = parseInt(nnNumOutputsElem.value);
  network = new NeuralNetwork(numIn, numHid, numOut);

}


function draw() {
  if (newCanvasHeight) {
    let width = currCanvasParentElem.clientWidth;
    resizeCanvas(width, canvasHeight);
    newCanvasHeight = false;
  }
  if (trainingSectionIsActive) train();
  //if (shapesSectionIsActive) shapes();
  //if (autoIncPointElem.checked) doIncPointXY();
}
