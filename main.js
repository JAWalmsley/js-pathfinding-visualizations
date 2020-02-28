/* Name: Jack Walmsley
 * Date: 2020-02-13
 * Filename: main.js
 * Purpose: Creates and draws a grid of nodes, provides parent classes for all node types
 */

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");
let cBounds = c.getBoundingClientRect();

const DEFAULT_NODE_SIZE = 30;   // Node width and height by default
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;  // # of nodes per side of canvas
let gridArray = []; // 2-D array of all items in the grid

let algorithmUpdateInterval;
let algorithmSpeed = 5;
let defaultAlgorithmDelay = 30;
let finished = false;

// Create empty y arrays at all x positions of gridArray so they can be accessed in format gridArray[x][y]
for (let x = 0; x < GRID_SIZE; x++) {
    gridArray[x] = [];
}

/**
 * Misc. useful functions
 */
class Helpers {
    /**
     * Gets displacement from x and y components
     *
     * @param deltaX - The x component of the displacement
     * @param deltaY - The y component of the displacement
     * @returns {number} - The euclidean distance resulting
     */
    static pythagoreanTheorem(deltaX, deltaY) {
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }

    /**
     * Creates a random hex value from 000000 to FFFFFF
     *
     * @returns {string} - The random color code
     */
    static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}

// Randomize the start and end node colours for prettiness
let startNodeColour = Helpers.getRandomColor();
let endNodeColour = Helpers.getRandomColor();

/**
 * Update the screen, draw all grid items
 */
function update() {
    GridItem.drawGrid();
}

function changeAlgorithmSpeed(amount) {
    // Only change the value if it won't go below 0, that would be weird
    if (algorithmSpeed > 1 || amount > 0) {
        algorithmSpeed += amount;
    }
    algorithmUpdateInterval = setInterval(updateAStar, defaultAlgorithmDelay / algorithmSpeed);
    document.getElementById("speed-counter").innerText = "Current Speed: " + algorithmSpeed;
}


// Mouse and keyboard input

let mouseIsDown = false;
let placingWall; // true for placing walls, false for deleting walls
let placingEnd = false;

function keyDownHandler(event) {
    placingEnd = event.key === "e";
}

function keyUpHandler(event) {
    if (event.key === "e") {
        placingEnd = false;
    }
}

function mouseDownHandler(event) {
    let clickX = event.pageX - c.offsetLeft,
        clickY = event.pageY - c.offsetTop;
    let selectedItem = GridItem.getGridItemAtPosition(clickX, clickY);
    if (!selectedItem) {
        return;
    }
    if (placingEnd) {
        endNode.fillColour = "#FFF";
        endNode = selectedItem;
        endNode.fillColour = endNodeColour;
        update();
    } else {
        mouseIsDown = true;
        // If the user first clicks on a wall, start deleting walls. Otherwise, start placing walls.
        placingWall = !(selectedItem instanceof Wall);
        mouseDragHandler(event); // Run the drag code on a single click so user don't have to move mouse for a new wall to be made
    }
}

function mouseDragHandler(event) {
    if (mouseIsDown) {
        let clickX = event.pageX - c.offsetLeft,
            clickY = event.pageY - c.offsetTop;
        let selectedItem = GridItem.getGridItemAtPosition(clickX, clickY);
        // You can't put a wall on top of the goal or start
        if (selectedItem !== startNode && selectedItem !== endNode) {
            if (selectedItem instanceof Wall && !placingWall) {
                new AStarNode(selectedItem.x, selectedItem.y);
                update();   // Only update if something new is actually placed, to avoid horrendous lag
            } else if (selectedItem instanceof Node && placingWall) {
                new Wall(selectedItem.x, selectedItem.y);
                update();
            }
        }
    }
}

c.addEventListener('mousedown', mouseDownHandler);
c.addEventListener('mouseup', function () {
    mouseIsDown = false;
});
c.addEventListener('keydown', keyDownHandler);
c.addEventListener('keyup', keyUpHandler);
c.addEventListener('mousemove', mouseDragHandler);
