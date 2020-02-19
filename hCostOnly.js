

let pathArray = [];
let hCosts = {};
let gCosts = {};
let fCosts = {};

function calculateGCost(n) {
  return gCosts[n] = Node.getDistance(n, startNode);
}

function calculateHCost(n) {
  return hCosts[n] = Node.getDistance(n, endNode);
}

function calculateFCost(n) {
  return fCosts[n] = calculateHCost(n) + calculateGCost(n);
}

let currNode = startNode;

let interval = setInterval(updateAlgorithm, 300);

function updateAlgorithm() {
  if (currNode === endNode) {
    console.log("WIN!");
    clearInterval(interval);
  } else {
    let nextCurrNode = currNode;
    currNode.getNeighbors().forEach(function(neighbor) {
      calculateHCost(neighbor);
      if (neighbor === endNode) {
        nextCurrNode = neighbor;
      }
      else if (calculateHCost(neighbor) < calculateHCost(nextCurrNode) && !pathArray.includes(neighbor)) {
        nextCurrNode = neighbor;
        // console.log("Moved to " + currNode.x + " , " + currNode.y + " because " + calculateHCost(neighbor) + " is less than " + calculateHCost(currNode));
      }
    });
    currNode = nextCurrNode;
    pathArray.push(currNode);
    update();
  }
}
