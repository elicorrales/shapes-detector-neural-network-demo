const learningRateSliderElem = document.getElementById('learningRateSlider');
const learningRateElem = document.getElementById('learningRate');
const trainingWaitSliderElem = document.getElementById('trainingWaitSlider');
const trainingWaitElem = document.getElementById('trainingWait');
const autoRelearnElem = document.getElementById('autoRelearn');

let trainingStartTime = new Date().getTime();
let allTrained = false;
let showedAllTrained = false;
let autoRelearn = false;
let timeRanOut = false;
let output_errors;

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



const isAllTrained = (data, errors) => {
    for (let i = 0; i < data.outputs.length; i++) {
        if (Math.abs(data.outputs[i] - errors[i]) > 0.1) return false;
    }
    return true;
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

    if (thereWasACriticalError) return;
    if (timeRanOut) return;

    try {

        //background(0);

        if (allTrained) {
            if (!showedAllTrained) {
                showMessages('success', 'All Trained');
                showedAllTrained = true;
            }
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

            let numOutputs = training_data[0].outputs.length;

            if (!allTrained) {
                for (let i = 0; i < 50; i++) {
                    let data = random(training_data);
                    let errors = network.predict(data.inputs);
                    allTrained = isAllTrained(data, errors);
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
                        let outputs = network.predict(random(training_data).inputs);
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