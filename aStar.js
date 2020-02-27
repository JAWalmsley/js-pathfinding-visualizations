/* Name: Jack Walmsley
 * Date: 2020-02-26
 * Filename: aStar.js
 * Purpose: Runs the A* path finding algorithm
 */

class AStarNode extends Node {
    constructor(x, y, fillColour = "#FFF") {
        super(x, y, fillColour);
        // G Cost is the cost to move from the start node to this node
        this.gCost = Infinity;
        // H cost is the cost to move from this node to the end node
        this.hCost = 0;
        // F cost is simply H cost  + G cost
        this.fCost = Infinity;
        this.parentNode;
    }

    /**
     * Calculates the H cost of this node, using euclidean distance
     *
     * @returns {number} The euclidean distance from this node to endNode
     */
    calculateHCost() {
        return Node.getDistance(this, endNode);
    }

    /**
     * Calculates the F cost of this node
     *
     * @returns {number} This node's G cost + this node's H cost
     */
    calculateFCost() {
        return this.hCost + this.gCost;
    }

    /**
     * Draws the node onscreen, with its F cost written on the bottom for added visualization
     */
    draw() {
        super.draw();
        ctx.font = "10px Arial";
        ctx.fillStyle = "red";
        ctx.textAlign = "right";
        ctx.fillText(Math.round(this.calculateFCost() * 100) / 100, this.x * this.width + this.width, this.y * this.height + this.height);
    }
}

Node.populateNodes(AStarNode); // Populate the grid with A* nodes

// The node that the algorithm starts at
startNode = new AStarNode(2, 2, Helpers.getRandomColor());

// The startNode has zero cost to get to itself
startNode.gCost = 0;

// The node that is considered the goal for the algorithm
endNode = new AStarNode(17, 10, Helpers.getRandomColor());

openNodes = [startNode]; // Nodes that can be visited, originally only contains startNode
closedNodes = []; // Nodes that have been checked and are not the fastest path

update(); // Update once to see the grid

let currNode; // The node the algorithm is currently considering

/**
 * Updates the A* algorithm
 *
 * Find the node with lowest fCost, find its neighbors and add them to openNodes, calculate all the neighbors' costs
 */
function updateAStar() {
    if (!openNodes.length < 1) {
        // Sort openNodes by fCost
        openNodes.sort(function (a, b) {
            return b.fCost - a.fCost;
        });

        currNode = openNodes.pop();
        closedNodes.push(currNode);

        currNode.getNeighbors().forEach(function (n) {
            // Only consider nodes that haven't been removed from consideration already
            if (closedNodes.includes(n)) {
                return;
            }

            let newG = currNode.gCost + Node.getDistance(n, currNode);
            // Update the neighbor's costs if it hasn't been checked yet, or if it can be reached with a lower gCost
            if (!openNodes.includes(n) || newG < n.gCost) {
                n.gCost = newG;
                n.hCost = n.calculateHCost();
                n.fCost = n.calculateFCost();
                n.parentNode = currNode;
                if (!openNodes.includes(n)) {
                    openNodes.push(n);
                }
            }
        }); // forEach neighbor

        if (currNode === endNode) {
            console.log("WIN");
            clearInterval(algorithmUpdateInterval);
            // Draw final path in green
            let currPathNode = endNode;
            while (currPathNode !== startNode) {
                console.log(currPathNode);
                currPathNode.fillColour = "#00F";
                currPathNode = currPathNode.parentNode;
            }
        }
    } // !openNodes.empty()
    else { // THere are no nodes that can be moved to (openNodes is empty)
        alert("Map is unsolvable!");
        clearInterval(algorithmUpdateInterval);
    }

    currNode.fillColour = "#F0F"; // Make the nodes involved in the path finding purple
    update(); // Draw the grid onscreen

}
