let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const DEFAULT_NODE_SIZE = 30;
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;
let nodeArray = [];
for (let x = 0; x < GRID_SIZE; x++) {
  nodeArray[x] = [];
}

let pathArray = [];

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
    this.gCost = 0;
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

  calculateGCost() {
    this.gCost = Node.getDistance(this, startNode);
    return this.gCost;
  }

  calculateHCost() {
    this.hCost = Node.getDistance(this, endNode);
    return this.hCost;
  }

  calculateFCost() {
    return this.calculateGCost() + this.calculateHCost();
  }

  getNeighbors() {
    this.neighbors = [];
    //
    for (let nx = this.x - 1; nx <= this.x + 1; nx++) {
      for (let ny = this.y - 1; ny <= this.y + 1; ny++) {
        // You can't be your own neighbor
        if (nx == this.x && ny == this.y) {
          continue;
        } else if (Node.isNode(nx, ny)) {
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
    ctx.fillText(Math.round(this.calculateHCost() * 100) / 100, this.x * this.width + this.width, this.y * this.height + this.height);
    // ctx.fillText(this.x, this.x * this.width + this.width, this.y * this.height + this.height);

  }
}

Node.populateNodes();

startNode = new Node(2, 2, Helpers.getRandomColor());
endNode = new Node(15, 2, Helpers.getRandomColor());
currNode = startNode;


async function update() {
  // Make the path of the algorithm blue
  if (currNode != endNode) {
    currNode.fillColour = "#00f"
  }
  Node.drawNodes();
}

function updateAlgorithm() {
  if(currNode == endNode) {
    console.log("WIN!")
    clearInterval(interval);
  }
  else {
    var nextCurrNode = currNode.getNeighbors()[0];
    currNode.getNeighbors().forEach(function(neighbor) {
      if(neighbor == endNode) {
        nextCurrNode = neighbor;
      }
      if (neighbor.calculateHCost() < currNode.calculateHCost() && !pathArray.includes(neighbor)) {
        nextCurrNode = neighbor;
        console.log("Moved to " + currNode.x + currNode.y);
      }
    })
    currNode = nextCurrNode;
    pathArray.push(currNode);
    update();
  }
}
// ctx.font = "10px Arial";
//
// ctx.fillStyle = "red";
// ctx.textAlign = "left";
// ctx.fillText("77", 0, 30);

var interval = setInterval(updateAlgorithm, 3000);
