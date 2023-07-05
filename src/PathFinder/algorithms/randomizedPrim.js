import * as utils from './utils.js';


export default function randomizedPrim(grid, startPos, finishPos){
    const newGrid = grid.slice();
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
    newGrid[randomX][randomY].nodeType = "normal";
    let cells = utils.getNeighbors(newGrid, newGrid[randomX][randomY], "distance");
    let idx = 0;
    while (cells.length > 0){
        if (idx++ == 5){
            return newGrid;
        }
        let cell = cells.pop(Math.floor(Math.random() * cells.length));
        let neighbors = utils.getNeighbors(newGrid, cell, "distance");
        let randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        randomNeighbor.nodeType = "normal";
        let betweenCell = utils.getBetween(grid, cell, randomNeighbor);
        betweenCell.nodeType = "normal";
        console.log(idx, "->", cell, randomNeighbor, betweenCell);
        cells.push(...neighbors);
    }



    return newGrid;
}

