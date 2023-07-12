import * as utils from './utils.js';

const toVisit = new utils.PriorityQueue((a, b) => a.f - b.f);


var MAX_ROW = 0;
var MAX_COL = 0;
var FINISH_POS = null;
const calculated = [];
const visited = [];


function addToVisit(grid, pos){
    if (typeof pos === "object"){
        var xPos = pos[0];
        var yPos = pos[1];
        var currNode = grid[xPos][yPos];
        currNode.f = utils.getEcludianDistance(currNode, FINISH_POS);
        //console.log("adding", currNode);
        toVisit.enqueue(currNode);
        if (xPos === FINISH_POS.row && yPos === FINISH_POS.col) {
            return true;
          }
    }
    return false;
}

export default function jumpPointSearch(grid, startPos, finishPos){
    MAX_ROW = grid.length;
    MAX_COL = grid[0].length;
    FINISH_POS = finishPos;
    console.log("first", FINISH_POS);
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    grid[startPos.row][startPos.col].g = 0;
    grid[startPos.row][startPos.col].f = utils.getEcludianDistance(grid[startPos.row][startPos.col], grid[finishPos.row][finishPos.col]);
    toVisit.enqueue(grid[startPos.row][startPos.col]);
    while (!toVisit.isEmpty()){
        let currNode = toVisit.dequeue();
        visited.push(currNode);
        console.log("Current node", currNode);
        if (currNode.row === finishPos.row && currNode.col === finishPos.col){
            //console.log("returning");
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        }

        // horizontal-vertical pruning
        if (addToVisit(grid, straightPrune(grid, currNode, -1, 0)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, straightPrune(grid, currNode, 0, -1)))
        return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, straightPrune(grid, currNode, 1, 0)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, straightPrune(grid, currNode, 0, 1)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];

        // Diagonal pruning
        if (addToVisit(grid, diagonalPrune(grid, currNode, -1, -1)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, diagonalPrune(grid, currNode, 1, -1)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, diagonalPrune(grid, currNode, 1, 1)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        if (addToVisit(grid, diagonalPrune(grid, currNode, -1, 1)))
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
    }
    return [visited.slice(1), []];
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
        if (currNode.nodeType === "wall") return undefined;
        console.log("Straight Prune=>", [newRow, newCol], stepX, stepY);
        //visited.push(currNode);
        if (newRow === FINISH_POS.row && newCol === FINISH_POS.col){
            console.log("found finish");
            return [newRow, newCol];
        }
        
        // forced neighbor checking
        if (stepX == 0){
            // check for below
            if (grid[newRow + 1]?.[newCol]?.nodeType === "wall" && grid[newRow + 1]?.[newCol + stepY]?.nodeType !== "wall"){
                console.log("stepX=0 returning", newRow + 1, newCol + stepY);
                return [startNode.row, startNode.col];

            }
            // check for above
            if (grid[newRow - 1]?.[newCol]?.nodeType === "wall" && grid[newRow - 1][newCol + stepY]?.nodeType !== "wall"){
                console.log("stepX=0 returning", newRow + 1, newCol + stepY);
                return [startNode.row, startNode.col];
            }
            
        }
        else if (stepY == 0){
            // check for right
            if (grid[newRow]?.[newCol + 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + 1]?.nodeType !== "wall"){
                console.log("stepY=0 returning",  [newRow, newCol + 1]);
                return [startNode.row, startNode.col];
            }
            // check for left
            if (grid[newRow]?.[newCol - 1]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol - 1]?.nodeType !== "wall"){
                console.log("stepY=0 returning",  [newRow, newCol - 1]);
                return [startNode.row, startNode.col];

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
            if (currNode.nodeType === "wall") return undefined;
            console.log("Vertical Prune=>", [newRow, newCol], stepX, stepY);
            //visited.push(currNode);
            if (newRow === FINISH_POS.row && newCol === FINISH_POS.col){
                console.log("found finish");
                return [newRow, newCol];
            }
        // forced neighbor checking
        if (grid[newRow + stepX]?.[newCol]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            console.log("diag1 returning", [newRow + stepX, newCol + stepY]);
            return [startNode.row, startNode.col];
        }
        else{
            addToVisit(grid, straightPrune(grid, grid[newRow][newCol], stepX, 0));
        }
        if (grid[newRow]?.[newCol + stepY]?.nodeType === "wall" && grid[newRow + stepX]?.[newCol + stepY]?.nodeType !== "wall"){
            console.log("diag2 returning", [newRow + stepX, newCol + stepY]);
            return [startNode.row, startNode.col];
        }
        else{
            addToVisit(grid, straightPrune(grid, grid[newRow][newCol], 0, stepY));
        }
    }
}
