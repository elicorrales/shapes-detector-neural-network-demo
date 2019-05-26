const homeNavBtnElem = document.getElementById('homeNavBtn');
const trainNavBtnElem = document.getElementById('trainNavBtn');
const shapesNavBtnElem = document.getElementById('shapesNavBtn');
const aboutNavBtnElem = document.getElementById('aboutNavBtn');
const trainingSectionElem = document.getElementById('trainingSection');
const shapesSectionElem = document.getElementById('shapesSection');


const doShowTrainingSection = () => {
    shapesSectionIsActive = false;
    trainingSectionIsActive = true;

    homeNavBtnElem.className = '';
    trainNavBtnElem.className = 'active';
    shapesNavBtnElem.className = '';
    aboutNavBtnElem.className = '';

    trainingSectionElem.style.display = 'block';
    shapesSectionElem.style.display = 'none';
    currCanvasParentElem = trainingCanvasParentElem;
    canvas.parent(currCanvasParentElem.id);
    doResizeCanvas();
    background(0);
}

const doShowShapesSection = () => {
    shapesSectionIsActive = true;
    trainingSectionIsActive = false;
    homeNavBtnElem.className = '';
    trainNavBtnElem.className = '';
    shapesNavBtnElem.className = 'active';
    aboutNavBtnElem.className = '';

    trainingSectionElem.style.display = 'none';
    shapesSectionElem.style.display = 'block';
    currCanvasParentElem = shapesCanvasParentElem;
    canvas.parent(currCanvasParentElem.id);
    doResizeCanvas();
    background(255);
    let numInputs = parseInt(nnNumInputsElem.value);
    numInputsElem.innerHTML = numInputs;
    numVert = numInputs/numHorz;
    numHorzElem.innerHTML = numHorz;
    numVertElem.innerHTML = numVert;
    if (numHorz !== numVert) {
        showMessages('warning','Horz != Vert');
    }
}

