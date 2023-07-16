import * as utils from './utils.js';

const toVisit = new utils.PriorityQueue((a, b) => a.g - b.g);


var MAX_ROW = 0;
var MAX_COL = 0;
var FINISH_NODE = null;
const expanded = [];
const visited = [];


function addToVisit(grid, xPos, yPos, xPos2, yPos2){
    // First position
    var currNode = grid[xPos][yPos];
    currNode.f = utils.getEcludianDistance(currNode, FINISH_NODE);
    toVisit.enqueue(currNode);

    // Second Position
    var nextNode = grid[xPos2][yPos2];
    if (nextNode.nodeType === "finish"){
        nextNode.f = 0;
        toVisit.enqueue(nextNode);
    }
    else{
        nextNode.f = currNode.f +1;
        toVisit.enqueue(nextNode);
    }
    
}

export default function jumpPointSearch(grid, startPos, finishPos){
    MAX_ROW = grid.length;
    MAX_COL = grid[0].length;
    FINISH_NODE = finishPos;
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    grid[startPos.row][startPos.col].g = 0;
    grid[startPos.row][startPos.col].f = utils.getEcludianDistance(grid[startPos.row][startPos.col], grid[finishPos.row][finishPos.col]);
    toVisit.enqueue(grid[startPos.row][startPos.col]);
    while (!toVisit.isEmpty()){
        let currNode = toVisit.dequeue();
        visited.push(currNode);
        console.log("Current node", currNode);
        if (currNode.nodeType === "finish"){
            console.log("returning", visited);
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        }

        // horizontal/vertical pruning
        straightPrune(grid, currNode, -1, 0);
        straightPrune(grid, currNode, 0, -1);
        straightPrune(grid, currNode, 1, 0);
        straightPrune(grid, currNode, 0, 1);
            

        // Diagonal pruning
        diagonalPrune(grid, currNode, -1, -1);
        diagonalPrune(grid, currNode, 1, -1); 
        diagonalPrune(grid, currNode, 1, 1);
        diagonalPrune(grid, currNode, -1, 1);
    }
    return [expanded.slice(1), []];
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
            break;
        currNode = grid[newRow][newCol];
        currNode.g = startNode.g + 1;
        if (currNode.nodeType === "wall") return undefined;
        console.log("Straight Prune=>", [newRow, newCol], stepX, stepY);
        if (currNode.nodeType === "finish"){
            console.log("found finish");
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
        }
        if (expanded.includes(currNode)){
            return;
        }
        expanded.push(currNode);
        
        // forced neighbor checking
        if (stepX == 0){
            // check for below
            if (grid[newRow + 1]?.[newCol]?.nodeType === "wall" && grid[newRow + 1]?.[newCol + stepY]?.nodeType !== "wall"){
                console.log("stepX=0 returning", newRow + 1, newCol + stepY);
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);

            }
            // check for above
            if (grid[newRow - 1]?.[newCol]?.nodeType === "wall" && grid[newRow - 1][newCol + stepY]?.nodeType !== "wall"){
                console.log("stepX=0 returning", newRow + 1, newCol + stepY);
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            }
            
        }
        else if (stepY == 0){
            // check for right
            if (grid[newRow]?.[newCol + 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + 1]?.nodeType !== "wall"){
                console.log("stepY=0 returning",  [newRow, newCol + 1]);
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            }
            // check for left
            if (grid[newRow]?.[newCol - 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol - 1]?.nodeType !== "wall"){
                console.log("stepY=0 returning",  [newRow, newCol - 1]);
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);

            }
        }
        
    }
}

function diagonalPrune(grid, startNode, stepX, stepY){
    let currNode = startNode;
    while (true){
        let newRow = currNode.row + stepX;
        let newCol = currNode.col + stepY;
        if ((newRow < 0 || newRow >= MAX_ROW // check if the cell is valid, if not return node
            || 
            newCol < 0 || newCol >= MAX_COL
            ))
            break;
            currNode = grid[newRow][newCol];
            currNode.g = startNode.g + 1;
            if (currNode.nodeType === "wall") return undefined;
            console.log("Vertical Prune=>", [newRow, newCol], stepX, stepY);
            if (currNode.nodeType === "finish"){
                console.log("found finish");
                addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
            }
            if (expanded.includes(currNode)){
                return;
            }
            expanded.push(currNode);
        // forced neighbor checking
        if (grid[newRow + stepX]?.[newCol]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            console.log("diag1 returning", [newRow + stepX, newCol + stepY]);
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
        }
        else{
            straightPrune(grid, grid[newRow][newCol], stepX, 0);
        }
        if (grid[newRow]?.[newCol + stepY]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            console.log("diag2 returning", [newRow + stepX, newCol + stepY]);
            addToVisit(grid, startNode.row, startNode.col, currNode.row, currNode.col);
        }
        else{
            straightPrune(grid, grid[newRow][newCol], 0, stepY);
        }
    }
}
