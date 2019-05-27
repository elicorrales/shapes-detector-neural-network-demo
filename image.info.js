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

    constructor(grid, name, numericTarget) {
        this.inputs = grid.flat();
        this.name = name;
        // example, for  number type images, just enter the number.
        // for anything else, like a letter, or a shape
        this.target = parseInt(numericTarget); 

    }

    save = () => {
        if (localStorage && this.inputs && this.inputs.length > 0 && this.name && this.name.length > 0) {
            let num = localStorage.getItem('currentImageInfoNumber');
            if (num === undefined || num === 'null' || num === '' || isNaN(num) || num === null) {
                currentImageInfoNumber = 0;
            } else {
                currentImageInfoNumber = num;
            }
            localStorage.setItem(this.name + '-' + currentImageInfoNumber + '.json', JSON.stringify(this));
            currentImageInfoNumber = parseInt(currentImageInfoNumber);
            currentImageInfoNumber++;
            localStorage.setItem('currentImageInfoNumber', currentImageInfoNumber);
        }
    }

}