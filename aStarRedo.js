class AStarNode extends Node {
    constructor(x, y, fillColour = "#FFF") {
        super(x, y, fillColour);
        this.gCost = Infinity;
        this.hCost = 0;
        this.fCost = Infinity;
        this.parentNode;
    }

    calculateGCost() {
        if (this.parentNode) {
            return this.parentNode.gCost + 1;
        } else {
            return Node.getDistance(this, startNode);
            console.log("Node " + this + " has no parent!");
        }
    }

    calculateHCost() {
        return Node.getDistance(this, endNode);
    }

    calculateFCost() {
        return this.hCost + this.gCost;
    }

    draw() {
        super.draw();
        ctx.font = "10px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        ctx.fillText(Math.round(this.calculateFCost() * 100) / 100, this.x * this.width + this.width, this.y * this.height + this.height);
    }
}

Node.populateNodes(AStarNode); // Populate the grid with A* nodes

startNode = new AStarNode(2, 2, Helpers.getRandomColor());
startNode.gCost = 0;
startNode.fCost = 0;

endNode = new AStarNode(17, 10, Helpers.getRandomColor());

openNodes = [startNode];
closedNodes = [];

update(); // Update once to see the grid

let currNode; // The node the algorithm is currently considering

function updateAStar() {
    if (!openNodes.length < 1) {
        // Sort openNodes by fCost
        openNodes.sort(function(a, b){
            return b.fCost-a.fCost;
        });

        currNode = openNodes.pop();
        closedNodes.push(currNode);

        currNode.getNeighbors().forEach(function(n) {
            if(closedNodes.includes(n)) {
                return;
            }
            let newG = currNode.gCost + Node.getDistance(n, currNode);
            // Update the neighbor's costs if it hasn't been checked yet, or if it can be reached with a lower gCost
            if(!openNodes.includes(n) || newG < n.gCost) {
                n.gCost = newG;
                n.hCost = n.calculateHCost();
                n.fCost = n.calculateFCost();
                n.parentNode = currNode;
                if(!openNodes.includes(n)) {
                    openNodes.push(n);
                }
            }
        }); // forEach neighbor

        if (currNode === endNode) {
            console.log("WIN");
            clearInterval(algorithmUpdateInterval);
            // Draw final path in green
            let currPathNode = endNode;
            while(currPathNode !== startNode) {
                console.log(currPathNode);
                currPathNode.fillColour = "#00F";
                currPathNode = currPathNode.parentNode;
            }
        }
    } //!openNodes.empty()
    // Draw the grid onscreen
    currNode.fillColour = "#F0F";
    update();
}

