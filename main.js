let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const DEFAULT_NODE_SIZE = 30;
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;
let gridArray = [];

let algorithmUpdateInterval;

for (let x = 0; x < GRID_SIZE; x++) {
    gridArray[x] = [];
}

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

    /**
     * Sleeps for a give amount of time
     *
     * @param ms - The time to sleep in ms
     * @returns {Promise<unknown>}
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class DrawableObject {
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

    click() {
        console.log(this.x + " " + this.y);
    }
}

class Node extends GridItem {
    constructor(x, y, fillColour = "#FFF", strokeColour = "#000") {
        super(x, y, fillColour, strokeColour);
        this.gCost = Infinity;
        this.hCost = 0;
    }

    /**
     * Returns the absolute distance between two nodes
     *
     * @param node1 - The start node
     * @param node2 - The end node
     * @returns {number} - The absolute distance between the two nodes
     */
    static getDistance(node1, node2) {
        return Helpers.pythagoreanTheorem(node1.x - node2.x, node1.y - node2.y);
    }

    /**
     * Fills the grid with nodes
     */
    static populateNodes() {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                gridArray[x][y] = new Node(x, y);
            }
        }
    }

    /**
     * returns if there is a Node at (x, y)
     *
     * @param x - The x location to check
     * @param y - The y location to check
     * @returns {boolean} - Whether there is a node at that location
     */
    static isNode(x, y) {
        if (typeof (gridArray[x]) == 'undefined') {
            return false;
        } else return gridArray[x][y] instanceof Node;
    }

    /**
     * Draws the node on the screen, with stats in the corner
     */
    draw() {
        super.draw();
        ctx.font = "10px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        ctx.fillText(Math.round(calculateFCost(this) * 100) / 100, this.x * this.width + this.width, this.y * this.height + this.height);
        console.log(calculateFCost(this));
        // ctx.fillText(this.x, this.x * this.width + this.width, this.y * this.height + this.height);
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

    draw () {
        super.draw();
    }
}

/**
 * Update the screen, draw all grid items
 */
function update() {
    // Make the path of the algorithm blue
    if (currNode !== endNode) {
        currNode.fillColour = "#00f";
    }
    GridItem.drawGrid();
}

function clickHandler(event) {
    let clickX = event.pageX - c.offsetLeft,
        clickY = event.pageY - c.offsetTop;

    for (let x = 0; x < gridArray.length; x++) {
        let nodeWidth = gridArray[x][0].width;
        // If clickX is inside current x column
        if (clickX > x * nodeWidth && clickX < (x + 1) * nodeWidth) {
            for (let y = 0; y < gridArray[x].length; y++) {
                let nodeHeight = gridArray[x][y].height;
                // If clickY is inside current y row
                if (clickY > y * nodeHeight && clickY < (y + 1) * nodeHeight) {
                    if (Wall.isWall(x, y)) {
                        gridArray[x][y] = new Node(x, y);
                    } else {
                        gridArray[x][y] = new Wall(x, y);
                    }

                    update();
                }
            }
        }
    }
}

c.addEventListener('click', clickHandler, false);

Node.populateNodes();

startNode = new Node(2, 2, Helpers.getRandomColor());
endNode = new Node(17, 10, Helpers.getRandomColor());
