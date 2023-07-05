import * as utils from './utils.js';

export default function jumpPointSearch(grid, startPos, finishPos){
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    grid[startPos.row][startPos.col].g = 0;
    grid[startPos.row][startPos.col].f = utils.getEcludianDistance(grid[startPos.row][startPos.col], grid[finishPos.row][finishPos.col]);
    const toVisit = new utils.PriorityQueue((a, b) => a.f - b.f);
    toVisit.enqueue(grid[startPos.row][startPos.col]);
    const visited = [];
    while (!toVisit.isEmpty()){
        let currNode = toVisit.dequeue();
        visited.push(currNode);
        if (currNode.row === finishPos.row && currNode.col === finishPos.col)
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        // for (let neighbor of utils.getNeighbors(grid, currNode, "diagonal")){
        //     if (visited.includes(neighbor) || neighbor.nodeType === "wall") continue;
        //         if (!toVisit.queue.includes(neighbor)) {
        //             if (isAJumpPoint(neighbor)){
        //                 neighbor.g = currNode.g + utils.calculateGScore(currNode, neighbor);
        //                 neighbor.h = utils.getEcludianDistance(neighbor, grid[finishPos.row][finishPos.col]);
        //                 neighbor.f = neighbor.g + neighbor.h;
        //                 toVisit.enqueue(neighbor);
        //             }
        //         }
        //     }
    }

}

function pruneNeighbors(grid, startNode){
    let currNode = startNode;
    const straightSteps = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    const diagonalSteps = [[1, 0], [0, -1], [0, 1], [-1, 0], [-1, -1], [1, 1], [-1, 1], [1, -1]];
    while (!isAJumpPoint(currNode)){
        straightSteps.forEach(item => {
            while (true){
                let newRow = currNode.row + item[0];
                let newCol = currNode.col + item[1];
                if ((newRow < 0 || newRow >= max_row
                    || 
                    newCol < 0 || newCol >= max_col
                    ||
                    grid[newRow][newCol].nodeType === "wall"))
                    break;
                else
                    recursed.push("node");
            }

        });
    }
}


function isAJumpPoint(){
    if (currNode.row === finishPos.row && currNode.col === finishPos.col)
        return true;
    if(hasAForcedNeighbor(node))
        return true;
    if(ruleThree(node))
        return true;
    return false;
}


