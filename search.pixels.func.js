const autoIncPointElem = document.getElementById('autoIncPoint');
const numInputsElem = document.getElementById('numInputs');
const numHorzElem = document.getElementById('numHorz');
const numVertElem = document.getElementById('numVert');

let currY = 0;
let currX = 0;
let currPixelIdx = 0;

let topBlackX = -1;
let topBlackY = -1;
let bottomBlackX = -1;
let bottomBlackY = -1;
let leftBlackX = -1;
let leftBlackY = -1;
let rightBlackX = -1;
let rightBlackY = -1;

let numHorz = 1;
let numVert = 1;

let imageRegion;
let imageStartX;
let imageStartY;
let currGridSquareImage;
let currFilledGridSquaresImage;
let summedFilledGridSquaresImage;

const doClearCanvas = () => {
    background(255);
    pointXElem.value = 0;
    pointYElem.value = 0;
    currX = 0;
    currY = 0;
    topBlackX = -1;
    topBlackY = -1;
    bottomBlackX = -1;
    bottomBlackY = -1;
    leftBlackX = -1;
    leftBlackY = -1;
    rightBlackX = -1;
    rightBlackY = -1;
    currPixelIdx = 0;
}

const goToNextPoint = (x, y) => {
    if (currX >= width - 1) {
        currX = 0;
        currY++;
        if (currY >= height) {
            currY = 0;
            return false;
        }
        return true;
    } else {
        currX++;
        return true;
    }
}

const isCurrentPixelBlack = () => {
    currPixelIdx = (currX + currY * width) * 4;
    if (pixels[currPixelIdx] != 255) return true;
    else return false;
}

const doChangeCurrX = (obj) => {
    currX = parseInt(obj.value);
}

const doChangeCurrY = (obj) => {
    currY = parseInt(obj.value);
}

const doIncHorzResolution = () => {
    clearMessages();
    numHorz++;
    numHorzElem.innerHTML = numHorz;
    let numInputs = parseInt(nnNumInputsElem.value);
    numInputsElem.innerHTML = numInputs;
    let badNumber = numInputs % numHorz;
    numVert = numInputs / numHorz;
    numVertElem.innerHTML = numVert;
    if (badNumber) {
        showMessages('danger', 'Choose Another Horz');
        return;
    }
    numVert = numInputs / numHorz;
    numVertElem.innerHTML = numVert;
    if (numVert !== numHorz) {
        showMessages('danger', 'Hozr Must Equal Vert. NN inputs must be a square.(4,9,16,25,36,49)');
        return;
    }
}
const doDecHorzResolution = () => {
    clearMessages();
    numHorz--;
    if (numHorz < 1) {
        showMessages('danger', 'Choose Another Horz');
        return;
    }
    numHorzElem.innerHTML = numHorz;
    let numInputs = parseInt(nnNumInputsElem.value);
    numInputsElem.innerHTML = numInputs;
    let badNumber = numInputs % numHorz;
    numVert = numInputs / numHorz;
    numVertElem.innerHTML = numVert;
    if (badNumber) {
        showMessages('danger', 'Choose Another Horz');
        return;
    }
    numVert = numInputs / numHorz;
    numVertElem.innerHTML = numVert;
    if (numVert !== numHorz) {
        showMessages('danger', 'Hozr Must Equal Vert. NN inputs must be a square. (4,9,16,25,36,49)');
        return;
    }
}

const gridSquares = (r, g, b) => {
    noFill();
    let boundaryWidth = rightBlackX - leftBlackX;
    let boundaryHeight = bottomBlackY - topBlackY;
    let cols = numHorz;
    let rows = numVert;
    let horzResolution = boundaryWidth / cols;
    let vertResolution = boundaryHeight / rows;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            stroke(r, g, b, 255);
            rect(leftBlackX + i * horzResolution, topBlackY + j * vertResolution, horzResolution, vertResolution);
        }
    }
}

const doFillGridSquares = () => {
    currGridSquareImage = undefined;
    currFilledGridSquaresImage = undefined;
    summedFilledGridSquaresImage = undefined;
    background(255);
    gridSquares(255, 255, 255);//erase the visible grid lines
    if (imageRegion) {
        image(imageRegion, imageStartX, imageStartY);
    }
    let boundaryWidth = rightBlackX - leftBlackX;
    let boundaryHeight = bottomBlackY - topBlackY;
    let cols = numHorz;
    let rows = numVert;
    let horzResolution = boundaryWidth / cols;
    let vertResolution = boundaryHeight / rows;
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {

            //erase canvas, put original image back in, for next grid square check
            //background(255);
            //image(imageRegion, imageStartX, imageStartY);

            //grab just current square of grid
            currGridSquareImage = get(leftBlackX + i * horzResolution, topBlackY + j * vertResolution, horzResolution, vertResolution);
            currGridSquareImage.loadPixels();

            //check current grid square for black
            for (let p=0; p<currGridSquareImage.pixels.length; p+=4) {
                if ((currGridSquareImage.pixels[p] === 0) 
                && (currGridSquareImage.pixels[p+1] === 0) 
                && (currGridSquareImage.pixels[p+2] === 0)) { 
                    noStroke();
                    fill(0,0,0);
                    rect(1 + leftBlackX + i * horzResolution, 1+ topBlackY + j * vertResolution, horzResolution - 1, vertResolution - 1);
                    break;
                } else {
                    stroke(254,0,0);
                    noFill();
                    rect(leftBlackX + i * horzResolution, topBlackY + j * vertResolution, horzResolution, vertResolution);
                }
            };
        }
    }

}
//let currGridSquareImage;
//let currFilledSquaresImage;
//let summedFilledSquaresImage;

const doShapeGrid = () => {
    gridSquares(255, 0, 0);//grid lines
}

const doShapeBoundarySearch = () => {
    currX = 0;
    currY = 0;
    let foundBlackPoint = false;
    showMessages('info', 'Fast Pixel Check..');
    loadPixels();
    while (1 === 1) {
        if (isCurrentPixelBlack()) {
            foundBlackPoint = true;
            if (topBlackX < 0) {
                topBlackX = currX;
                topBlackY = currY;
                bottomBlackX = currX;
                bottomBlackY = currY;
                leftBlackX = currX;
                leftBlackY = currY;
                rightBlackX = currX;
                rightBlackY = currY;
            }
            if (bottomBlackX < currX || bottomBlackY < currY) {
                bottomBlackX = currX;
                bottomBlackY = currY;
            }
            if (leftBlackX > currX) {
                leftBlackX = currX;
                leftBlackY = currY;
            }
            if (rightBlackX < currX) {
                rightBlackX = currX;
                rightBlackY = currY;
            }
        }
        if (!goToNextPoint(currX, currY)) {
            break;
        }
    }
    if (foundBlackPoint) {
        imageRegion = get(leftBlackX, topBlackY, rightBlackX - leftBlackX, bottomBlackY - topBlackY);
        imageStartX = leftBlackX;
        imageStartY = topBlackY;
        stroke(255, 0, 0);
        noFill();
        rect(topBlackX - 3, topBlackY - 3, 6, 6);
        rect(bottomBlackX - 3, bottomBlackY - 3, 6, 6);
        rect(leftBlackX - 3, leftBlackY - 3, 6, 6);
        rect(rightBlackX - 3, rightBlackY - 3, 6, 6);
        rect(leftBlackX, topBlackY, rightBlackX - leftBlackX, bottomBlackY - topBlackY);
    }
    let boundaryWidth = rightBlackX - leftBlackX;
    let boundaryHeight = bottomBlackY - topBlackY;
    if (boundaryWidth < 100 && boundaryHeight < 100) {
        showMessages('danger', 'Image Too Small');
        return;
    }
    showMessages('info', 'Fast Pixel Done');
}

const doSaveImage = () => {
    if (imageRegion) {
        save(imageRegion, 'myImage.jpg');
    }
}

const doPlaceImage = () => {
    if (imageRegion) {
        image(imageRegion, imageStartX, imageStartY);
    }
}

