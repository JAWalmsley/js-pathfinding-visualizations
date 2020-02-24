shortestPath = [];
gCosts = {startNode: 0};    // Cost from start node to node
hCosts = {};    // Estimated cost from node to end node
fCosts = {};    // Combined g and h costs

openNodes = [startNode];
closedNodes = [];
let currNode = startNode;


update();

function calculateGCost(n) {
    return gCosts[n] = Node.getDistance(n, startNode);
}

function calculateHCost(n) {
    return hCosts[n] = Node.getDistance(n, endNode);
}

function calculateFCost(n) {
    if (typeof gCosts[n] != "undefined") {
        return fCosts[n] = calculateHCost(n) + gCosts[n];
    } else {
        return Infinity;
    }
}

function startAlgorithm() {
    algorithmUpdateInterval = setInterval(updateAStar, 300);
}

function updateAStar() {
    if(openNodes.length > 0) {
        let q = openNodes[0];  // The node with the lowest f cost (the next node to go to)
        openNodes.forEach(function(node) {
            if(calculateFCost(node) < calculateFCost(q)) {
                q = node;
                console.log(calculateFCost(q));
                openNodes.splice(q);
                closedNodes.push(q);
            }
        });

        currNode = q;

        currNode.getNeighbors().forEach(function(neighbor) {
            if(neighbor === endNode) {
                clearInterval(algorithmUpdateInterval);
                console.log('WIN');
            } else {
                gCosts[neighbor] = gCosts[q] + 1;
                calculateFCost(neighbor);
                openNodes.push(neighbor);
            }
        })
    }
    update();
}