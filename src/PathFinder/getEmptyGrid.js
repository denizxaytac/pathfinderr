
import './custom.css';


class Node {
    constructor(col, row, type) {
        this.col = col;
        this.row = row;
        this.nodeType = type;
        this.weight = 1;
        this.f = 0;
        this.g = 0;
        this.h = 0;

    }
} 

export default function getEmptyGrid(width, height, startPos, finishPos){
    let colNumber = Math.floor(width.current / 24);
    let rowNumber = Math.floor(height.current / 25) * 0.92;
    let grid = [];
    for (let rowIdx = 0; rowIdx < rowNumber; rowIdx++){
        let row = [];
        for (let colIdx = 0; colIdx < colNumber; colIdx++){
            if (startPos.current.row === rowIdx && startPos.current.col === colIdx){
                row.push(new Node(colIdx, rowIdx, "start"));
            }
            else if (finishPos.current.row === rowIdx && finishPos.current.col === colIdx){
                row.push(new Node(colIdx, rowIdx, "finish"));
            }
            else{
                row.push(new Node(colIdx, rowIdx, "normal"));
            }
        }
        grid.push(row);
    }
    return grid;
}