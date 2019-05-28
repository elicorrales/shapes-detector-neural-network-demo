let currentImageInfoNumber = 0;
if (localStorage) {
    let num = localStorage.getItem('currentImageInfoNumber');
    if (num === undefined || num === 'null' || num === '') {
        currentImageInfoNumber = 0;
    } else {
        currentImageInfoNumber = num;
    }
}

class MyImageInfo {

    constructor(flatGrid, numRows, numCols, name, numericTarget) {
        this.inputs = flatGrid;
        this.name = name;
        // example, for  number type images, just enter the number.
        // for anything else, like a letter, or a shape
        this.target = parseInt(numericTarget); 
        this.numGridRows = numRows;
        this.numGridCols = numCols;
    }

    save = () => {
        if (localStorage && this.inputs && this.inputs.length > 0 && this.name && this.name.length > 0) {
            let num = localStorage.getItem('currentImageInfoNumber');
            if (num === undefined || num === 'null' || num === '' || isNaN(num) || num === null) {
                currentImageInfoNumber = 0;
            } else {
                currentImageInfoNumber = num;
            }
            this.storageKey = this.name + '-' + currentImageInfoNumber + '-Shapes' + this.numGridRows + 'x' + this.numGridCols + '.json';
            localStorage.setItem(this.storageKey, JSON.stringify(this));
            currentImageInfoNumber = parseInt(currentImageInfoNumber);
            currentImageInfoNumber++;
            localStorage.setItem('currentImageInfoNumber', currentImageInfoNumber);
        }
    }

}