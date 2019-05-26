const trainingCanvasParentElem = document.getElementById('trainingCanvasParent');
const shapesCanvasParentElem = document.getElementById('shapesCanvasParent');
const numBlackPixelsElem = document.getElementById('numBlackPixels');
const canvasWidthElem = document.getElementById('canvasWidth');
const canvasHeightElem = document.getElementById('canvasHeight');
const firstPixelElem = document.getElementById('firstPixel');
const pointXElem = document.getElementById('pointX');
const pointYElem = document.getElementById('pointY');
const newPixelElem = document.getElementById('newPixel');
var   currCanvasParentElem = trainingCanvasParentElem;


const doChangeCanvasHeight = (obj) => {
    canvasHeight = obj.value;
    doResizeCanvas();
}

const doResizeCanvas = () => {
    let width = currCanvasParentElem.clientWidth;
    resizeCanvas(width, canvasHeight);
    canvasWidthElem.innerHTML = width;
    canvasHeightElem.innerHTML = canvasHeight;
    background(255);
}

const doCheckPixels = () => {
    loadPixels();
    if (isCurrentPixelBlack()) {
        showMessages('info','Pixel is Black: x:'+currX+',y:'+currY+',px:'+currPixelIdx);
        return true;
    } else {
        showMessages('info','NO Black Pixel at: x:'+currX+',y:'+currY+',px:'+currPixelIdx);
        return false;
    }
}

const doPointAtXY = () => {
    let x = parseInt(pointXElem.value);
    let y = parseInt(pointYElem.value);
    stroke(0);
    point(x, y);
    newPixelElem.value = ( x + y * width) * 4;
}

const doNewPixel = () => {
}

const doIncPixelLoc = () => {
    let currPixelIdx = parseInt(newPixelElem.value);
    currPixelIdx+=4;
    newPixelElem.value = currPixelIdx;
}

const doIncPointXY = () => {
    clearMessages();
    if (!goToNextPoint(currX,currY)) {
        showMessages('danger','At End of Canvas');
    }
    if (doCheckPixels()) {
        autoIncPointElem.checked = false;
        fill(255,0,0);
        rect(currX-3,currY-3,6,6);
    }
    pointXElem.value = currX;
    pointYElem.value = currY;
}