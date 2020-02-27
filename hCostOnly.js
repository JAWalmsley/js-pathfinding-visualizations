let pathArray = [];
let hCosts = {};
let gCosts = {};
let fCosts = {};
let currNode = startNode;

// Update the algorithm once so the user can draw on the grid
update();


function calculateGCost(n) {
  return gCosts[n] = Node.getDistance(n, startNode);
}

function calculateHCost(n) {
  return hCosts[n] = Node.getDistance(n, endNode);
}

function calculateFCost(n) {
  return fCosts[n] = calculateHCost(n) + calculateGCost(n);
}

function startAlgorithm() {
  algorithmUpdateInterval = setInterval(updateHCostOnly, 300);
}

function updateHCostOnly() {
  if (currNode !== endNode) {
    let nextCurrNode = currNode;
    currNode.getNeighbors(false).forEach(function (neighbor) {
      if(!Wall.isWall(neighbor.x, neighbor.y)) {
        calculateHCost(neighbor);
        if (neighbor === endNode) {
          nextCurrNode = neighbor;
        } else if (calculateHCost(neighbor) < calculateHCost(nextCurrNode) && !pathArray.includes(neighbor)) {
          nextCurrNode = neighbor;
          console.log("Moved to " + currNode.x + " , " + currNode.y + " because " + calculateHCost(neighbor) + " is less than " + calculateHCost(currNode));
        }
      }
    });
    currNode = nextCurrNode;
    pathArray.push(currNode);
    update();
  } else {
    console.log("WIN!");
    clearInterval(algorithmUpdateInterval);
  }
}
