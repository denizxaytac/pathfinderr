import * as utils from './utils.js';

var toVisit = new utils.PriorityQueue((a, b) => a.g - b.g);


var MAX_ROW = 0;
var MAX_COL = 0;
var FINISH_NODE = null;
var expanded = [];
var visited = [];
var paths = [];

function addToVisit(grid, xPos, yPos, xPos2, yPos2){
    // First position
    var currNode = grid[xPos][yPos];
    currNode.f = utils.getEcludianDistance(currNode, FINISH_NODE);
    // Second Position
    var nextNode = grid[xPos2][yPos2];
    var prevNode = visited.slice(-1)[0];
    paths[currNode.row][currNode.col] = prevNode;
    paths[nextNode.row][nextNode.col] = currNode;
    if (nextNode.nodeType === "finish"){
        nextNode.f = 0;
        toVisit.enqueue(nextNode);
    }
    else{
        nextNode.f = currNode.f +1;
        toVisit.enqueue(nextNode);
    }
    visited.push(currNode);
}

export default function jumpPointSearch(grid, startPos, finishPos){
    MAX_ROW = grid.length;
    MAX_COL = grid[0].length;
    FINISH_NODE = finishPos;
    paths = utils.getInitialDistances(grid, startPos)[1];
    expanded = [];
    visited = [];
    toVisit = new utils.PriorityQueue((a, b) => a.g - b.g);
    grid[startPos.row][startPos.col].g = 0;
    grid[startPos.row][startPos.col].f = utils.getEcludianDistance(grid[startPos.row][startPos.col], grid[finishPos.row][finishPos.col]);
    toVisit.enqueue(grid[startPos.row][startPos.col]);
    var steps = [[-1, 0], [0, -1], [1, 0], [0, 1], [-1, -1], [1, -1], [1, 1], [-1, 1]];
    var stepIdx = 0;
    var cycle = 0;
    while (!toVisit.isEmpty()){
        cycle = 0;
        let currNode = toVisit.dequeue();
        visited.push(currNode);
        console.log("Current node", currNode);
        if (currNode.nodeType === "finish"){
            return [expanded, utils.reconstructPathJPS(paths, grid[finishPos.row][finishPos.col])];
        }

        // horizontal/vertical pruning
        var foundJumpPoint = false;
        while (true){
            if (steps[stepIdx][0] === 0 || steps[stepIdx][1] === 0){
                foundJumpPoint = straightPrune(grid, currNode, steps[stepIdx][0], steps[stepIdx][1]);
            }
            else{
                foundJumpPoint = diagonalPrune(grid, currNode, steps[stepIdx][0], steps[stepIdx][1]);
            }
            if (foundJumpPoint){
                console.log("Jump point found");
                break;
            }
            else{
                stepIdx += 1;
                if (stepIdx > 7){
                    stepIdx = 0;
                    break;
                }
            }
            cycle += 1;
        }
    }
    return [expanded, []];
}

function straightPrune(grid, startNode, stepX, stepY){
    let currNode = startNode;
    while (true){
        let newRow = currNode.row + stepX;
        let newCol = currNode.col + stepY;
        if ((newRow < 0 || newRow >= MAX_ROW // check if the cell is valid, if not return node
            || 
            newCol < 0 || newCol >= MAX_COL
            ))
            return false;
        currNode = grid[newRow][newCol];
        currNode.g = startNode.g + 1;
        if (currNode.nodeType === "wall") return false;
        //console.log("Straight Prune=>", [newRow, newCol], stepX, stepY);
        if (currNode.nodeType === "finish"){
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            return true;
        }
        if (expanded.includes(currNode)){
            return false;
        }
        expanded.push(currNode);
        
        // forced neighbor checking
        if (stepX === 0){
            // check for below
            if (grid[newRow + 1]?.[newCol]?.nodeType === "wall" && grid[newRow + 1]?.[newCol + stepY]?.nodeType !== "wall"){
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
                return true;

            }
            // check for above
            if (grid[newRow - 1]?.[newCol]?.nodeType === "wall" && grid[newRow - 1][newCol + stepY]?.nodeType !== "wall"){
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
                return true;
            }
            
        }
        else if (stepY === 0){
            // check for right
            if (grid[newRow]?.[newCol + 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + 1]?.nodeType !== "wall"){
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
                return true;
            }
            // check for left
            if (grid[newRow]?.[newCol - 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol - 1]?.nodeType !== "wall"){
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
                return true;

            }
        }
        
    }
}

function diagonalPrune(grid, startNode, stepX, stepY){
    let currNode = startNode;
    var horizontalPrune = false;
    var verticalPrune = false;
    while (true){
        let newRow = currNode.row + stepX;
        let newCol = currNode.col + stepY;
        if ((newRow < 0 || newRow >= MAX_ROW // check if the cell is valid, if not return node
            || 
            newCol < 0 || newCol >= MAX_COL
            ))
            return false;
            currNode = grid[newRow][newCol];
            currNode.g = startNode.g + 1;
            if (currNode.nodeType === "wall") return false;
            //console.log("Vertical Prune=>", [newRow, newCol], stepX, stepY);
            if (currNode.nodeType === "finish"){
                console.log("found finish");
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
                return true;
            }
            if (expanded.includes(currNode)){
                return false;
            }
            expanded.push(currNode);
        // forced neighbor checking
        if (grid[newRow + stepX]?.[newCol]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            return true;
        }
        else{
            verticalPrune = straightPrune(grid, grid[newRow][newCol], stepX, 0);
        }
        if (grid[newRow]?.[newCol + stepY]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            return true;
        }
        else{
            horizontalPrune = straightPrune(grid, grid[newRow][newCol], 0, stepY);
        }
        if (horizontalPrune || verticalPrune){
            return true;
        }
    }
}
