const learningRateSliderElem = document.getElementById('learningRateSlider');
const learningRateElem = document.getElementById('learningRate');
const trainingWaitSliderElem = document.getElementById('trainingWaitSlider');
const trainingWaitElem = document.getElementById('trainingWait');
const autoRelearnElem = document.getElementById('autoRelearn');
const delRegexElem = document.getElementById('delRegex');

let trainingStartTime = new Date().getTime();
let allTrained = true;
let showedAllTrained = false;
let autoRelearn = false;
let timeRanOut = false;
let output_errors;

let currentTrainingData;
let typeOfTrainingData;

showMessages('info', 'Training...');

if (localStorage) {
    let learningRate = localStorage.getItem('learningRate');
    if (learningRate) learningRateSliderElem.value = learningRate;
}
learningRateElem.innerHTML = learningRateSliderElem.value;

if (localStorage) {
    let wait = localStorage.getItem('wait');
    if (wait) trainingWaitSliderElem.value = wait;
}
trainingWaitElem.innerHTML = trainingWaitSliderElem.value;


const doSaveShapesTrainingData = (whichShapes,rows,cols) => {
    clearMessages();
    if (currentTrainingData !== undefined && typeOfTrainingData!==undefined && typeOfTrainingData.startsWith('Shapes')) {
        save(JSON.stringify(currentTrainingData), whichShapes+rows+'x'+cols+'.json');
    } else {
        showMessages('danger','No Shapes Training Data to save');
    }
}


const isAllTrained = (data, errors) => {
    if (data===undefined || data.length===0 || errors===undefined || errors.length===0 || data.length!==errors.length) {
        throw 'danger','Cant Train: Data Array Len ('
                +data.length
                +') incompatible with Errors Array Len ('
                +errors.length
                +'). You might be missing some shape(digit?).'
                +' You can add it to the training data, or you can reduce the Network output nodes.';
    }
    for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i] - errors[i]) > 0.03) return false;
    }
    return true;
}

const doChooseLogicGatesTrainingData = () => {
    clearMessages();
    clearSecondaryMessages();
    allTrained = false;
    thereWasACriticalError = false;
    currentTrainingData = logicGatesTrainingData;
    typeOfTrainingData = 'Logic';
}

const doChooseDigits8x8TrainingData = () => {
    clearMessages();
    clearSecondaryMessages();
    allTrained = false;
    thereWasACriticalError = false;
    currentTrainingData = digits8x8TrainingData;
    typeOfTrainingData = 'Digits8x8';
}

const findLocalStorageItems = (query) => {
  let results = [];
  for (let i in localStorage) {
    if (localStorage.hasOwnProperty(i)) {
      if (i.match(query) || (!query && typeof i === 'string')) {
        value = JSON.parse(localStorage.getItem(i));
        results.push({key:i,val:value});
      }
    }
  }
  return results;
}


const doChooseShapesTrainingData = (whichShapes,rows,cols) => {
    typeOfTrainingData = whichShapes+rows+'x'+cols;
    clearMessages();
    clearSecondaryMessages();
    if (numVert!==parseInt(rows) || numHorz!==parseInt(cols)) {
        showSecondaryMessages('danger','Network grid rows x cols != ' + rows + 'x' + cols);
        return;
    }
    allTrained = false;
    thereWasACriticalError = false;
    let trainingData = [];
    let outputs = [];
    if (localStorage) {
        let items = findLocalStorageItems('.*'+whichShapes+rows+'x'+cols+'.json');
        items.forEach( item => {
            let foundOutput = outputs.find( o => {return o === item.val.target});
            if (foundOutput===undefined) outputs.push(item.val.target);
            trainingData.push(item.val);
        });
    }
    //of the training array that is created here from the local storage,
    //each member only knows about itself.  but, what we need as outputs of the network
    //is one output for each possibility; i.e., if the training data consist of the digits,
    //we need 9 outputs.
    //furthermore, EACH of the training samples needs to have that same outputs[], indicating
    //the 9 possibilities.
    //AND further, each of those output[] arrays could be different per sample, because
    // there should be a "1" in the output[] location that has to do with the digit of that
    //sample.
    outputs.sort();//here, the array contains [0,1,2,3,....] which is wrong..
    trainingData.forEach( t => {
        let uniqueOutputs = outputs.slice();//make a copy
        outputs.forEach( (o,idx) => {
            //there should be a "1" only in the outputs[x] position that is related to that digit possiblity
            //all other outputs[x] should be "0".
            if (o === t.target) {
                uniqueOutputs[idx] = 1;
            } else {
                uniqueOutputs[idx] = 0;
            }
        })
        t.outputs = uniqueOutputs;
    });
    currentTrainingData = trainingData;
    typeOfTrainingData = whichShapes;
}

const doRemoveShapesTrainingData = (whichShapes,rows,cols) => {
    let regex = whichShapes+rows+'x'+cols;

    if (regex===undefined || regex.length<1) {
        showMessages('danger','Need A Regex in order to delete training data');
        return;
    }

    let stuffDeleted = false;
    if (localStorage) {
        let items = findLocalStorageItems('.*' + regex + '.*.json');
        items.forEach( item => {
            localStorage.removeItem(item.key);
            stuffDeleted = true;
        });
    }

    if (stuffDeleted) {
        showMessages('success','Matching \'' + regex + '\' was deleted.');
    }
    delRegexElem.value = undefined;
}

const doRemoveLocalStorageData = () => {
    let regex = delRegexElem.value;
    if (regex===undefined || regex.length<1) {
        showMessages('danger','Need A Regex in order to delete training data');
        return;
    }

    let stuffDeleted = false;
    if (localStorage) {
        let items = findLocalStorageItems('.*' + regex + '.*.json');
        items.forEach( item => {
            localStorage.removeItem(item.key);
            stuffDeleted = true;
        });
    }

    if (stuffDeleted) {
        showMessages('success','Matching \'' + regex + '\' was deleted.');
    }
    delRegexElem.value = undefined;
}


const doChangeLearningRate = () => {
    clearMessages();
    let learningRate = learningRateSliderElem.value;
    learningRateElem.innerHTML = learningRate;
    if (localStorage) {
        localStorage.setItem('learningRate', learningRate);
    }
    doCreateNetwork('danger', 'Changed Learning Rate - Retraining...');
    trainingStartTime = new Date().getTime();
    allTrained = false;
}

const doChangeTrainingWaitTime = () => {
    clearMessages();
    let wait = trainingWaitSliderElem.value;
    trainingWaitElem.innerHTML = wait;
    if (localStorage) {
        localStorage.setItem('wait', wait);
    }
    doCreateNetwork('danger', 'Changed Training Wait Time - Retraining...');
    trainingStartTime = new Date().getTime();
    allTrained = false;
}

const doAutoRelearn = () => {
    autoRelearn = autoRelearnElem.checked;
}

const train = () => {


    if (currentTrainingData === undefined || currentTrainingData.length < 1) {
        showMessages('danger','No Training Data Selected Or There is no data');
        return;
    }

    if (thereWasACriticalError) return;
    if (timeRanOut) return;

    try {

        //background(0);

        if (allTrained) {
            if (!showedAllTrained) {
                showMessages('success', 'All Trained');
                showedAllTrained = true;
            }
            return;
        }

        // depending on how the network was initialized,
        // it may NOT train, so we just throw it away
        // and recreate the network.
        let currentTime = new Date().getTime();
        let deltaTrainingTime = (currentTime - trainingStartTime) / 1000;
        let trainingWait = parseInt(trainingWaitSliderElem.value);
        if (!allTrained) showMessages('info','Training ....' + deltaTrainingTime);
        if (deltaTrainingTime > trainingWait && !allTrained) {
            timeRanOut = true;
            showMessages('danger','Time Ran Out');
            if (autoRelearn) {
                doCreateNetwork('danger', 'Time Ran Out -  Retraining...');
            }
        }

        if (network != undefined) {

            let numOutputs = currentTrainingData[0].outputs.length;

            if (!allTrained) {
                for (let i = 0; i < 50; i++) {
                    let data = random(currentTrainingData);
                    let errors = network.predict(data.inputs);
                    allTrained = isAllTrained(data.outputs, errors);
                    output_errors = network.train(data.inputs, data.outputs);
                }
            }
            network.setLearningRate(learningRateSliderElem.value);

            background(0);
            let resolution =  10;//numOutputs*4;
            let cols = width / resolution;
            let rows = height / resolution;
            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                        noStroke();
                        let outputs = network.predict(random(currentTrainingData).inputs);
                        let whichColor = 0;
            let red = 0;
            let green = 0;
            let blue = 0;
                        outputs.forEach( o => {
                            if (whichColor>2) whichColor = 0;
                            switch (whichColor) {
                                case 0:
                                    red += 100*(o/(1-o));
                                    break;
                                case 1:
                                    blue += 100*(o/(1-o));
                                    break;
                                case 2:
                                    green += 100*(o/(1-o));
                                    break;
                            }
                            whichColor++;
                        });
                        fill(red, blue, green);
                        rect(i * resolution, j * resolution, resolution, resolution);
                }
            }
        }
        
    } catch (error) {
        console.log(error);
        showMessages('danger', error);
        thereWasACriticalError = true;
    }
}