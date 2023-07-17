
export default function randomStair(grid, startPos, finishPos){
    let newGrid = [...grid];
    let maxRow = grid.length;
    //let maxCol = grid[0].length;
    let rowIdx = maxRow - 1;
    let colIdx = 0;
    while (rowIdx > 0){
        grid[rowIdx][colIdx].nodeType = "wall";
        rowIdx -= 1;
        colIdx += 1;
    }
    rowIdx += 2;
    while (rowIdx < finishPos.row){
        grid[rowIdx][colIdx].nodeType = "wall";
        rowIdx += 1;
        colIdx += 1;
    }
    while (rowIdx > 0){
        grid[rowIdx][colIdx].nodeType = "wall";
        rowIdx -= 1;
        colIdx += 1;
    }
    
    return newGrid;
}
