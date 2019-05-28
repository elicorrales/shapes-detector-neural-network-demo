const autoIncPointElem = document.getElementById('autoIncPoint');
const numInputsElem = document.getElementById('numInputs');
const numHorzElem = document.getElementById('numHorz');
const numVertElem = document.getElementById('numVert');
const shadeElem = document.getElementById('shade');
const imageNameElem = document.getElementById('imageName');
const imageTargetElem = document.getElementById('imageTarget');

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
let shade = 10;

// for saving image info
let imageInfoGridArray;
let imageInfoName;
let imageInfoTarget;

    if (localStorage) {
        numHorz = parseInt(localStorage.getItem('numHorz'));
    }
    if (localStorage) {
        numVert = parseInt(localStorage.getItem('numVert'));
    }
    let numInputs = parseInt(nnNumInputsElem.value);
    if (numHorz === undefined || isNaN(numHorz)) {
        numHorz = 1;
    }
    numVert = numInputs/numHorz
    numHorzElem.innerHTML = numHorz;
    numVertElem.innerHTML = numVert;

    if (numHorz !== numVert) {
        showMessages('warning','Horz != Vert');
    }

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
    imageRegion = undefined;
    imageStartX = -1;
    imageStartY = -1;
    currGridSquareImage = undefined;
    currFilledGridSquaresImage = undefined;
    summedFilledGridSquaresImage = undefined;
    imageInfoGridArray = undefined;

}

const doIncShade = () => {
    if (!shade || shade === '' || shade === 'undefined' || shade === 'null') shade = 10;
    if (shade < 255) shade++;
    shadeElem.innerHTML = shade;
    if (localStorage) {
        localStorage.setItem('shade',shade);
    }
}
const doDecShade = () => {
    if (!shade || shade === '' || shade === 'undefined' || shade === 'null') shade = 10;
    if (shade > 0) shade--;
    shadeElem.innerHTML = shade;
    if (localStorage) {
        localStorage.setItem('shade',shade);
    }
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
    clearSecondaryMessages();
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
    if (localStorage) {
        localStorage.setItem('numHorz',numHorz);
    }
    if (localStorage) {
        localStorage.setItem('numVert',numVert);
    }
}
const doDecHorzResolution = () => {
    clearMessages();
    clearSecondaryMessages();
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
    if (localStorage) {
        localStorage.setItem('numHorz',numHorz);
    }
    if (localStorage) {
        localStorage.setItem('numVert',numVert);
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
    clearMessages();
    if (imageRegion === undefined || leftBlackX===undefined || leftBlackX===-1) {
        showMessages('danger','No Image to Fill Grid Squares');
        return false;
    }

    currGridSquareImage = undefined;
    background(255);
        image(imageRegion, imageStartX, imageStartY);
    let boundaryWidth = rightBlackX - leftBlackX;
    let boundaryHeight = bottomBlackY - topBlackY;
    let cols = numHorz;
    let rows = numVert;
    let horzResolution = boundaryWidth / cols;
    let vertResolution = boundaryHeight / rows;
    imageInfoGridArray = [];
    for (let i = 0; i < cols; i++) {

        let gridRow = [];
        for (let j = 0; j < rows; j++) {

            //grab just current square of grid
            currGridSquareImage = get(leftBlackX + j * horzResolution, topBlackY + i * vertResolution, horzResolution, vertResolution);
            currGridSquareImage.loadPixels();

            let foundOccupiedGridSquare = false;
            //check current grid square for black
            for (let p=0; p<currGridSquareImage.pixels.length; p+=4) {
                if ((currGridSquareImage.pixels[p] < shade)      //Red
                && (currGridSquareImage.pixels[p+1] < shade)     // Green 
                && (currGridSquareImage.pixels[p+2] < shade)) {  // Blue
                    foundOccupiedGridSquare = true;
                    noStroke();
                    fill(0,0,0);
                    rect(1 + leftBlackX + j * horzResolution, 1+ topBlackY + i * vertResolution, horzResolution - 1, vertResolution - 1);
                    gridRow.push(1);
                    break; //once we've found at least one black pixel, we dont need to keep checking that same grid square.
                }
            };
            if (!foundOccupiedGridSquare) {
                gridRow.push(0);
            }
        }
        imageInfoGridArray.push(gridRow);
    }

    return true;
}

const doShapeGrid = () => {
    clearMessages();
    if (imageRegion === undefined) {
        showMessages('danger','No Image to Add Grid Squares');
        return;
    }

    gridSquares(255, 0, 0);//grid lines
}

const doShapeBoundarySearch = () => {
    clearMessages();
    currX = 0;
    currY = 0;
    let foundBlackPoint = false;
    showMessages('info', 'Fast Pixel Check..');
    loadPixels();
    while (1 === 1) {
        if (isCurrentPixelBlack()) {
            //we only have to register that we found at least 1 black pixel,
            //becauase this loop will continue until every pixel is checked,
            //even if we already found one.
            //thus, finding one, means finding ALL the extremities.
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
        //lets try not bound the edges too tight to image....
        if (leftBlackX>1) leftBlackX-=2;
        if (rightBlackX<width-2) rightBlackX+=2;
        if (topBlackY>1) topBlackY-=2;
        if (bottomBlackY<width-2) bottomBlackY+=2;
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
        let boundaryWidth = rightBlackX - leftBlackX;
        let boundaryHeight = bottomBlackY - topBlackY;
        if (boundaryWidth < 100 && boundaryHeight < 100) {
            showMessages('danger', 'Image Too Small');
            return false;
        }
    }
    showMessages('info', 'Fast Pixel Done');
    return true;
}

const doSaveImage = () => {
    clearMessages();
    if (imageRegion !== undefined) {
        save(imageRegion, 'myImage.jpg');
    } else {
        showMessages('danger','No image to save');
    }
}

const areTheseTwoGridArraysEqual = (a,b) => {
    if (a === b) return true;
    if (a.length != b.length) {
        console.log('array a and b are not the same length');
        return false;
    }
    for (let i=0; i<a.length; i++) {
        if (a[i] !== b[i]) {
            console.log('array a and b were differet at idx ' + i);
            return false;
        }
    }
    return true;
}

const doSaveImageInfo = () => {
    clearMessages();
    clearSecondaryMessages();
    if (currentTrainingData===undefined) {
        showSecondaryMessages('danger','No Training Data Type Selected');
        return;
    }
    if (imageRegion===undefined || imageRegion.length === 0) {
        showMessages('danger','No Image Region Info to Save');
        return;
    }
    if (imageInfoGridArray===undefined || imageInfoGridArray.length === 0) {
        showMessages('danger','No Image Info Grid Array to Save');
        return;
    }
    if (imageInfoName===undefined || imageInfoName.length === 0) {
        showMessages('danger','Need Image Info Name to Save');
        return;
    }

    if (imageInfoTarget===undefined || imageInfoTarget.length === 0) {
        showMessages('danger','Need Image Info Target to Save');
        return;
    }

    let flatGrid = imageInfoGridArray.flat();
    let shapeNameMatches = [];
    for (let i=0; i<currentTrainingData.length; i++) {
         if (currentTrainingData[i].name === imageInfoName) {
             shapeNameMatches.push(currentTrainingData[i]);
         }
    };
    shapeNameMatches.forEach( sm => {
        console.log('comparing '+sm.storageKey+' to flat grid');
        if (areTheseTwoGridArraysEqual(flatGrid,sm.inputs)) {
            clearMessages();
            clearSecondaryMessages();
            showSecondaryMessages('warning','Pattern Previously Saved for: ' +imageInfoName);
            return;
        }
    })

    let myImageInfo = new MyImageInfo(flatGrid,numVert, numHorz, imageInfoName, imageInfoTarget);
    myImageInfo.save();
    showSecondaryMessages('success','Image \'' + imageInfoName + '\' saved.')
    doChooseShapesTrainingData('Shapes',numVert,numHorz);
}

const doImageName = (obj) => {
    imageInfoName = obj.value;
}

const doImageTarget = (obj) => {
    imageInfoTarget = obj.value;
}

const doPlaceImage = () => {
    clearMessages();
    if (imageRegion !== undefined) {
        background(255);
        image(imageRegion, imageStartX, imageStartY);
    } else {
        showMessages('danger','No Image To Place');
        return false;
    }
    return true;
}

const doGuess = () => {
    clearMessages();
    clearSecondaryMessages();
    if (currentTrainingData===undefined) {
        showSecondaryMessages('danger','No Training Data Type Selected');
        return;
    }
    /*
    if (imageInfoGridArray===undefined) {
        showSecondaryMessages('danger','No Grid Image. Did you draw one?')
        return;
    }
    */
    if (doPlaceImage()) {
        if (!doShapeBoundarySearch()) return;
        if (!doFillGridSquares()) return;
    } else {
        if (!doShapeBoundarySearch()) return;
        if (!doFillGridSquares()) return;
    }

    let guesses = network.predict(imageInfoGridArray.flat());
    console.log(guesses);
    let prevHighestGuessVal = 0;
    let highestGuess = 0;
    let highestGuessIdx = -1;
    guesses.forEach( (guess,gidx) => {
        if (highestGuess<guess) { prevHighestGuessVal = highestGuess; highestGuess = guess; highestGuessIdx = gidx; }
    });
    console.log(guesses);
    console.log('highest idx:',highestGuessIdx,' val:',highestGuess);
    let tdMatch = currentTrainingData.find( td => td.target === highestGuessIdx);
    if (tdMatch!==undefined) {
        showMessages('info','Possible Match:' + tdMatch.name + ':' + tdMatch.target);
        imageNameElem.value = tdMatch.name;
        imageTargetElem.value = tdMatch.target;
        imageInfoName = tdMatch.name;
        imageInfoTarget = tdMatch.target;
    }
}

const doReTrain = () => {
    clearMessages();
    clearSecondaryMessages();
    allTrained = false;
    trainingStartTime = new Date().getTime();
    train();
}