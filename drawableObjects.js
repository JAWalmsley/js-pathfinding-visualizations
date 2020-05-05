/* Name: Jack Walmsley
 * Date: 2020-02-27
 * Filename: drawableObjects.js
 * Purpose: Contains all parent classes for objects that are drawn on screen
 */
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
        ctx.lineWidth = 1;
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
     * Gets all the surrounding nodes, excluding diagonals, and updates this.neighbors
     *
     * @returns {[]|*[]} - An array of the surrounding nodes
     */
    getNeighbors() {
        let neighbors = [];
        for (let nx = this.x - 1; nx <= this.x + 1; nx++) {
            for (let ny = this.y - 1; ny <= this.y + 1; ny++) {
                // You can't be your own neighbor, must be adjacent no diagonals
                if (Node.isNode(nx, ny) && !(nx === this.x && ny === this.y) && (nx === this.x || ny === this.y)) {
                    neighbors.push(gridArray[nx][ny]);
                }
            }
        }
        return neighbors;
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
    static euclideanDistance(node1, node2) {
        return Helpers.pythagoreanTheorem(node1.x - node2.x, node1.y - node2.y);
    }

    /**
     * Returns the manhattan distance between two nodes
     *
     * @param node1 - The start node
     * @param node2 - The end node
     * @returns {number} - The manhattan distance between the two nodes
     */
    static manhattanDistance(node1, node2){
        return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
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
