/* Name: Jack Walmsley
 * Date: 2020-02-13
 * Filename: main.js
 * Purpose: Creates and draws a grid of nodes, provides parent classes for all node types
 */

let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const DEFAULT_NODE_SIZE = 10;   // Node width and height by default
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;  // # of nodes per side of canvas
let gridArray = []; // 2-D array of all items in the grid

let algorithmUpdateInterval;

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

class DrawableObject {
    /**
     * DrawableObject, anything that shows onscreen
     *
     * @param x x position in terms of the grid, NOT PIXELS
     * @param y y position in terms of the grid, NOT PIXELS
     * @param fillColour The colour to fill the inside of the square with
     * @param strokeColour The colour to stroke the border of the square with
     * @param width The width of the square
     * @param height The height of the square
     */
    constructor(x, y, fillColour, strokeColour, width = DEFAULT_NODE_SIZE, height = DEFAULT_NODE_SIZE) {
        this.x = x;
        this.y = y;
        this.fillColour = fillColour;
        this.strokeColour = strokeColour;
        this.width = width;
        this.height = height;
    }

    /**
     * Draws a rectangle of width and height at position x and y
     */
    draw() {
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
        ctx.strokeStyle = this.strokeColour;
        ctx.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
    }
}

class GridItem extends DrawableObject {
    /**
     * Any item that is in the grid, automatically added to gridArray
     *
     * @param x x position in terms of the grid, NOT PIXELS
     * @param y y position in terms of the grid, NOT PIXELS
     * @param fillColour The colour to fill the inside of the square with
     * @param strokeColour The colour to stroke the border of the square with
     */
    constructor(x, y, fillColour, strokeColour) {
        super(x, y, fillColour, strokeColour);
        gridArray[x][y] = this;
        this.neighbors = [];
    }

    /**
     * Draws all grid items
     */
    static drawGrid() {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                gridArray[x][y].draw();
            }
        }
    }

    static getGridItemAtPosition(xPos, yPos) {
        for (let x = 0; x < gridArray.length; x++) {
            let itemWidth = gridArray[x][0].width;
            // If xPos is inside current x column
            if (xPos > x * itemWidth && xPos < (x + 1) * itemWidth) {
                for (let y = 0; y < gridArray[x].length; y++) {
                    let itemHeight = gridArray[x][y].height;
                    // If yPos is inside current y row
                    if (yPos > y * itemHeight && yPos < (y + 1) * itemHeight) {
                        return gridArray[x][y];
                    }
                }
            }
        }
    }

    /**
     * Gets all the surrounding grid items, including diagonals, and updates this.neighbors
     *
     * @returns {[]|*[]} - An array of the surrounding nodes
     */
    getNeighbors() {
        this.neighbors = [];
        for (let nx = this.x - 1; nx <= this.x + 1; nx++) {
            for (let ny = this.y - 1; ny <= this.y + 1; ny++) {
                // You can't be your own neighbor
                if (Node.isNode(nx, ny) && !(nx === this.x && ny === this.y)) {
                    this.neighbors.push(gridArray[nx][ny]);
                }
            }
        }
        return this.neighbors;
    }
}

class Node extends GridItem {
    /**
     * The prototype node for any algorithm's own nodes
     *
     * @param x x position in terms of the grid
     * @param y y position in terms of the grid
     */
    constructor(x, y) {
        super(x, y, "#FFF", "#000");
    }

    /**
     * Returns the absolute distance between two nodes
     *
     * @param node1 - The start node
     * @param node2 - The end node
     * @returns {number} - The euclidean distance between the two nodes
     */
    static getDistance(node1, node2) {
        return Helpers.pythagoreanTheorem(node1.x - node2.x, node1.y - node2.y);
    }

    /**
     * Fills the grid with nodes of the specified type
     *
     * @param nodeType the type of node to populate the grid with (eg. aStarNode for an A* visualization)
     */
    static populateNodes(nodeType) {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                gridArray[x][y] = new nodeType(x, y);
            }
        }
    }

    /**
     * returns if there is a Node at (x, y)
     *
     * @param x The x location to check
     * @param y The y location to check
     * @returns {boolean} - Whether there is a node at that location
     */
    static isNode(x, y) {
        if (typeof (gridArray[x]) == 'undefined') {
            return false;
        } else return gridArray[x][y] instanceof Node;
    }
}

class Wall extends GridItem {
    constructor(x, y, fillColour = "#000", strokeColour = "#FFF") {
        super(x, y, fillColour, strokeColour);
    }

    /**
     * returns if there is a Wall at (x, y)
     *
     * @param x - The x location to check
     * @param y - The y location to check
     * @returns {boolean} - Whether there is a Wall at that location
     */
    static isWall(x, y) {
        if (typeof (gridArray[x]) == 'undefined') {
            return false;
        } else return gridArray[x][y] instanceof Wall;
    }

    draw() {
        super.draw();
    }
}

/**
 * Update the screen, draw all grid items
 */
function update() {
    GridItem.drawGrid();
}

let mouseIsDown = false;
let placingWall; // true for placing walls, false for deleting walls
let placingStart = false;
let placingEnd = false;

function keyDownHandler(event) {
    console.log("SWAG");
    if (event.key == "s") {
        placingStart = true;
        placingEnd = false;
    } else if (event.key == "e") {
        placingEnd = true;
        placingStart = false;
    } else {
        placingEnd = false;
        placingStart = false;
    }
    console.log(placingEnd);
}

function mouseDownHandler(event) {
    let clickX = event.pageX - c.offsetLeft,
        clickY = event.pageY - c.offsetTop;
    let selectedItem = GridItem.getGridItemAtPosition(clickX, clickY);
    console.log(selectedItem);
    if (placingEnd) {
        endNode.fillColour = "#FFF";
        endNode = selectedItem;
        endNode.fillColour = Helpers.getRandomColor();
        update();
    } else if (placingStart) {
        startNode.fillColour = "#FFF";
        startNode = selectedItem;
        startNode.fillColour = Helpers.getRandomColor();
        update();
    }
    else {
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
            } else if (selectedItem instanceof Node && placingWall) {
                new Wall(selectedItem.x, selectedItem.y);
            }
        }
        update();
    }
}

c.addEventListener('mousedown', mouseDownHandler);
c.addEventListener('mouseup', function () {
    mouseIsDown = false;
});
c.addEventListener('keydown', keyDownHandler);
c.addEventListener('mousemove', mouseDragHandler);
