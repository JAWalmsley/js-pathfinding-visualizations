let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const DEFAULT_NODE_SIZE = 30;
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;
let nodeArray = [];

for (let x = 0; x < GRID_SIZE; x++) {
    nodeArray[x] = [];
}

class Helpers {
    static pythagoreanTheorem(deltaX, deltaY) {
        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    }
    static getRandomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

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
    draw() {
        ctx.fillStyle = this.fillColour;
        ctx.fillRect(this.x * this.width, this.y * this.height, this.width, this.height);
        ctx.strokeStyle = this.strokeColour;
        ctx.strokeRect(this.x * this.width, this.y * this.height, this.width, this.height);
    }
}

class Node extends DrawableObject {
    constructor(x, y, fillColour = "#FFF", strokeColour = "#000") {
        super(x, y, fillColour, strokeColour);
        nodeArray[x][y] = this;
        this.gCost = Infinity;
        this.hCost = 0;
        this.neighbors = [];
    }

    static getDistance(node1, node2) {
        return Helpers.pythagoreanTheorem(node1.x - node2.x, node1.y - node2.y);
    }

    static drawNodes() {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                nodeArray[x][y].draw();
            }
        }
    }

    static populateNodes() {
        for (let x = 0; x < GRID_SIZE; x++) {
            for (let y = 0; y < GRID_SIZE; y++) {
                nodeArray[x][y] = new Node(x, y);
            }
        }
    }

    static isNode(x, y) {
        if (typeof(nodeArray[x]) !== 'undefined') {
            if (typeof(nodeArray[x][y]) !== 'undefined') {
                return true;
            }
        } else {
            return false;
        }
    }

    getNeighbors() {
        this.neighbors = [];
        for (let nx = this.x - 1; nx <= this.x + 1; nx++) {
            for (let ny = this.y - 1; ny <= this.y + 1; ny++) {
                // You can't be your own neighbor
                if (Node.isNode(nx, ny) && !(nx === this.x && ny === this.y)) {
                    this.neighbors.push(nodeArray[nx][ny]);
                }
            }
        }
        return this.neighbors;
    }

    draw() {
        super.draw();
        ctx.font = "10px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        // noinspection JSCheckFunctionSignatures
        ctx.fillText(Math.round(this.hCost * 100) / 100, this.x * this.width + this.width, this.y * this.height + this.height);
        // ctx.fillText(this.x, this.x * this.width + this.width, this.y * this.height + this.height);

    }
}

function update() {
    // Make the path of the algorithm blue
    if (currNode !== endNode) {
        currNode.fillColour = "#00f";
    }
    Node.drawNodes();
}

Node.populateNodes();

startNode = new Node(2, 2, Helpers.getRandomColor());
endNode = new Node(17, 10, Helpers.getRandomColor());