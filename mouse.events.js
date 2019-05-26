const atPointXElem = document.getElementById('atPointX');
const atPointYElem = document.getElementById('atPointY');

let mouseIsPressed = false;
let mouseIsReleased = false;
let mouseIsDragged = false;

let prevMouseX;
let prevMouseY;
let prevPixels;

mousePressed = () => {
    mouseIsPressed = true;
    mouseIsDragged = false;
}


mouseReleased = () => {
    mouseIsReleased = true;
    mouseIsDragged = false;
    prevMouseX = undefined;
    prevMouseY = undefined;
}


mouseDragged = () => {
    mouseIsDragged = true;
    stroke(0);
    //fill(0);
    if (!prevMouseX || !prevMouseY) {
        point(mouseX,mouseY);
        prevMouseX = mouseX; prevMouseY = mouseY;
    } else {
        line(prevMouseX,prevMouseY,mouseX,mouseY);
        prevMouseX = mouseX; prevMouseY = mouseY;
    }
}

mouseMoved = () => {
    if (mouseX>=0 && mouseX<=width && mouseY>=0 && mouseY<=height) {
        atPointXElem.innerHTML = mouseX;
        atPointYElem.innerHTML = mouseY;
    }
}

mouseClicked = () => {
    
    //this should mean we havent actually drawn anything on canvas since mouse didnt move, just clicked (on a point)
    if (!mouseIsDragged) {
        stroke(0);
        //fill(0);
        point(mouseX,mouseY);
    }
}
