export class PriorityQueue {
    constructor(comparefunction) {
      this.compare = comparefunction;
      this.queue = [];
    }
    enqueue(item) {
      this.queue.push(item);
      this.queue.sort(this.compare);
    }
    dequeue() {
        return this.queue.shift();
    }

    length() {
        return this.queue.length;
    }

    isEmpty(){
        return this.queue.length === 0;
    }
    has (item){
        if (this.queue.includes(item)){
            return true;
        }
        else{
            return false;
        }
    }
    peekLastItem(){
        return this.queue[this.queue.length - 1];
    }
    removeElement(element){
        const index = this.queue.indexOf(element);
        this.queue.splice(index, 1);
        this.queue.sort(this.compare);
    }
}

// the order of getting neighbors, adjacents array in this case
// might affect performance of DFS 
// normal: 4 diagonal: 8, distance: 2
export function getNeighbors(grid, node, type){
    const max_row = grid.length;
    const max_col = grid[0].length;
    let neighbors = [];
    var adjacents = [];
    if (type === "normal"){
        adjacents = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    }
    else if (type === "diagonal"){
        adjacents = [[1, 0], [0, -1], [0, 1], [-1, 0]];
    }
    else if (type === "distance"){ // calculating frontier cells for prim
        adjacents = [[2, 0], [0, -2], [0, 2], [-2, 0]];
    }
    adjacents.forEach(item => {
        let newRow = node.row + item[0];
        let newCol = node.col + item[1];
        if (!(newRow < 0 || newRow >= max_row
            || 
            newCol < 0 || newCol >= max_col))
            neighbors.push(grid[newRow][newCol]);
    });
    return neighbors;
}
export function getBetween(grid, cell1, cell2){
    let xDiff = cell2.row - cell1.row;
    let yDiff = cell2.col - cell1.col;
    // console.log(xDiff, yDiff, cell2.row - Math.floor(xDiff / 2), cell2.col - Math.floor(yDiff / 2));
    return grid[cell2.row - Math.floor(xDiff / 2)][cell2.col - Math.floor(yDiff / 2)];
}


export function getInitialDistances(grid, startPos){
    const rows = grid.length;
    const cols = grid[0].length;
    const distances = new Array(rows);
    const paths = new Array(rows);
    for (let i = 0; i < rows; i++) {
        distances[i] = new Array(cols);
        paths[i] = new Array(rows);
    for (let j = 0; j < cols; j++) {
        distances[i][j] = Infinity;
        paths[i][j] = undefined;
    }
    }
    distances[startPos.row][startPos.col] = 0;
    return [distances, paths];
}

export function reconstructPath(pathArray, startPos, finishPos) {
    const path = [];
    let curr_node = pathArray[finishPos.row][finishPos.col];
    while (curr_node !== undefined) {
        path.push(curr_node);
        curr_node = pathArray[curr_node.row][curr_node.col];
        if (curr_node.row === startPos.row && curr_node.col === startPos.col)
        break;
    }
    return path.reverse();
}

export function reconstructPathJPS(pathArray, finishPos) {
    const path = [];
    path.push(finishPos);
    let curr_node = pathArray[finishPos.row][finishPos.col];
    while (curr_node !== undefined) {
        if (path.includes(curr_node)) break;
        path.push(curr_node);
        if (curr_node.nodeType === "start") break;
        curr_node = pathArray[curr_node.row][curr_node.col];
    }
    return path.reverse();
}

export function reconstructPathJPS2(finishNode) {
    console.log("im here");
    const path = [];
    path.push(finishNode);
    let curr_node = finishNode.parent;
    while (curr_node !== undefined) {
        path.push(curr_node);
        curr_node = curr_node.parent;
    }
    return path.reverse();
}

export function getManhattanDistance(node1, node2) {
    const dx = Math.abs(node1.col - node2.col);
    const dy = Math.abs(node1.row - node2.row);
    return dx + dy;
}


export function getEcludianDistance(start_node, finish_node){
    let hx = start_node.row - finish_node.row;
    let hy = start_node.col - finish_node.col;
    return Math.sqrt(hx * hx + hy * hy);
}

export function calculateGScore(currNode, endNode) {
    let xDiff = currNode.row - endNode.row;
    let yDiff = currNode.col - endNode.col;
    if (Math.abs(xDiff) === 1 && Math.abs(yDiff))
        return Math.sqrt(2);
    return 1;
}


export const createArrayRange = (start, stop, step) =>
    Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
);

export function check2DArrayContains(array, element) {
    // element is a 2d array
    return array.some(subArray => JSON.stringify(subArray) === JSON.stringify(element));
}

export function randomRange(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;  
}