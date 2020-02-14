var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

const DEFAULT_NODE_SIZE = 30;
const GRID_SIZE = c.width / DEFAULT_NODE_SIZE;
var nodeArray = [];
for (var x = 0; x < GRID_SIZE; x++) {
  nodeArray[x] = [];
}

class Helpers {
  static pythagoreanTheorem(deltaX, deltaY) {
    return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
  }
  static getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
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
  }

  static getDistance(node1, node2) {
    return Helpers.pythagoreanTheorem(node1.x - node2.x, node1.y - node2.y);
  }

  static drawNodes() {
    for(var x = 0; x < GRID_SIZE; x++) {
        for(var y = 0; y < GRID_SIZE; y++) {
          nodeArray[x][y].draw();
        }
    }
  }

  static populateNodes() {
    for(var x = 0; x < GRID_SIZE; x++) {
        for(var y = 0; y < GRID_SIZE; y++) {
          nodeArray[x][y] = new Node(x, y);
        }
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
}

Node.populateNodes();

startNode = new Node(2, 2, Helpers.getRandomColor());
endNode = new Node(15, 15, Helpers.getRandomColor());
Node.drawNodes();
