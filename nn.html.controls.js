const nnNumInputsElem = document.getElementById('nnNumInputs');
const nnNumHiddenElem = document.getElementById('nnNumHidden');
const nnNumOutputsElem = document.getElementById('nnNumOutputs');

if (localStorage) {
    let numIn = localStorage.getItem('numIn');
    let numHid = localStorage.getItem('numHid');
    let numOut = localStorage.getItem('numOut');
    if (numIn) nnNumInputsElem.value = numIn;
    if (numHid) nnNumHiddenElem.value = numHid;
    if (numOut) nnNumOutputsElem.value = numOut;
}

const doCreateNetwork = (typeMsg, message) => {
    if (message) showMessages(typeMsg, message);
    else showMessages('info', 'Training...');
    allTrained = false;
    showedAllTrained = false;
    timeRanOut = false;
    trainingStartTime = new Date().getTime();
    let numIn = parseInt(nnNumInputsElem.value);
    let numHid = parseInt(nnNumHiddenElem.value);
    let numOut = parseInt(nnNumOutputsElem.value);
    network = new NeuralNetwork(numIn, numHid, numOut);
    thereWasACriticalError = false;
    if (localStorage) {
        localStorage.setItem('numIn',numIn);
        localStorage.setItem('numHid',numHid);
        localStorage.setItem('numOut',numOut);
    }
}