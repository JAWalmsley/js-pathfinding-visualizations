shortestPath = [];  // Nodes included in the shortest path from start to end nodes
parentNodes = [];
gCosts = [];    // Cost from start node to node
hCosts = [];    // Estimated cost from node to end node
fCosts = [];    // Combined g and h costs

//  Fill the arrays with empty lists so they can be accessed with gCosts[x][y], for example
for (let x = 0; x < GRID_SIZE; x++) {
    gCosts[x] = [];
    hCosts[x] = [];
    fCosts[x] = [];
    parentNodes[x] = [];
}

openNodes = [startNode];
closedNodes = [];
let currNode = startNode;

update();

function calculateGCost(n) {
    return gCosts[n.x][n.y] = Node.getDistance(n, startNode);
}

function calculateHCost(n) {
    return hCosts[n.x][n.y] = Node.getDistance(n, endNode);
}

function calculateFCost(n) {
    if (typeof gCosts[n.x][n.y] != "undefined") {
        return fCosts[n.y][n.y] = calculateHCost(n) + gCosts[n.x][n.y];
    } else {
        return fCosts[n.x][n.y] = Infinity;
    }
}

function startAlgorithm() {
    algorithmUpdateInterval = setInterval(updateAStar, 300);
}

function updateAStar() {
    if (openNodes.length > 0) {
        let q = openNodes[0];  // The node with the lowest f cost (the next node to go to)
        openNodes.forEach(function (node) {
            if (calculateFCost(node) <= calculateFCost(q)) {
                console.log(calculateFCost(node) + " is less than " + calculateFCost(q) + ", " + node);
                q = node;
                delete openNodes[q];
            } else {
            }
        });
        console.log("moved to " + q.x + ", " + q.y);
        currNode = q;
        closedNodes.push(currNode);

        currNode.getNeighbors().forEach(function (neighbor) {
            if (neighbor === endNode) {
                clearInterval(algorithmUpdateInterval);
                console.log('WIN');

                // Reconstruct the shortest path
                let currStep = neighbor;
                while(!shortestPath.includes(startNode)) {
                    currStep.fillColour = "#0F0"
                    shortestPath.push(parentNodes[currStep.x][currStep.y]);
                    currStep = parentNodes[currStep.x][currStep.y];
                }
            } else {
                gCosts[neighbor.x][neighbor.y] = calculateGCost(q) + 1;
                // If the neighbor is a worse path than the current node
                if (openNodes.includes(neighbor)) {
                    if (calculateFCost(neighbor) > calculateFCost(currNode)) {
                        delete openNodes[neighbor];
                        closedNodes.push(neighbor);
                    }
                } else if (!closedNodes.includes(neighbor)) {    // If neighbor not in openNodes or in closedNodes
                    openNodes.push(neighbor);
                    parentNodes[neighbor.x][neighbor.y] = currNode;
                }
                calculateFCost(neighbor);
            }
        })
    }
    update();
}