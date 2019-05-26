let currentImageInfoNumber = 0;

class MyImageInfo {

    constructor(grid, name, numericTarget) {
        this.grid = grid;
        this.name = name;
        // example, for  number type images, just enter the number.
        // for anything else, like a letter, or a shape
        this.target = numericTarget; 
    }

    save = () => {
        if (localStorage && this.grid && this.grid.length > 0 && this.name && this.name.length > 0) {
            localStorage.setItem(this.name + '-' + currentImageInfoNumber + '-'+ '.json', JSON.stringify(this));
        }
    }

}