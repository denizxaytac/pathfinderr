import * as utils from './utils.js';


export default function randomizedPrim(grid, startPos, finishPos){
    const newGrid = grid.slice();
    const visited = [];
    let mazeHeight = grid.length;
    let mazeWidth = grid[0].length;
    for(let i = 0; i < mazeHeight; i++){
        for(let j = 0; j < mazeWidth; j++){
            if (newGrid[i][j].nodeType === "normal")
            newGrid[i][j].nodeType = "wall";
        }
    }
    let randomX = Math.floor(Math.random() * (mazeHeight - 1));
    let randomY = Math.floor(Math.random() * (mazeWidth - 1));
    let currentCell = newGrid[randomX][randomY];
    let frontierCells = utils.getNeighbors(newGrid, currentCell, "distance");
    while (frontierCells.length > 0){
        currentCell = frontierCells.splice(Math.floor(Math.random() * frontierCells.length), 1)[0];
        if (currentCell.nodeType !== "start" || currentCell.nodeType !== "finish")
        currentCell.nodeType = "normal";
        visited.push(currentCell);
        let neighbors = utils.getNeighbors(newGrid, currentCell, "distance");
        for (var idx in neighbors){
            if (!visited.includes(neighbors[idx]))
                frontierCells.push(neighbors[idx]);
        }

        let randomFrontier = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (!(randomFrontier.nodeType === "start" ||randomFrontier.nodeType === "finish"))
            randomFrontier.nodeType = "normal";

        let betweenCell = utils.getBetween(grid, currentCell, randomFrontier);
        if (!(betweenCell.nodeType === "start" || betweenCell.nodeType === "finish"))
            betweenCell.nodeType = "normal";
        //console.log("cell:", currentCell, "\n random neighbor: ",randomFrontier, "\nbetween cell: ", betweenCell);
    }
    return newGrid;
}

