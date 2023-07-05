import * as utils from './utils.js';

export default function aStar(grid, startPos, finishPos){
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    const visited = [];
    const toVisit = new utils.PriorityQueue((a, b) => a.f - b.f);
    distances[startPos.row][startPos.col] += utils.getManhattanDistance(grid[startPos.row][startPos.col], grid[finishPos.row][finishPos.col]);
    toVisit.enqueue(grid[startPos.row][startPos.col]);
    while (!toVisit.isEmpty()){
        let currNode = toVisit.dequeue();
        visited.push(currNode);
        if (currNode.row === finishPos.row && currNode.col === finishPos.col)
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        for (let neighbor of utils.getNeighbors(grid, currNode, "normal")){
            if (visited.includes(neighbor) || neighbor.nodeType === "wall") continue;
            if (!toVisit.queue.includes(neighbor)) {
                neighbor.g = currNode.g + utils.calculateGScore(currNode, neighbor);
                neighbor.h = utils.getManhattanDistance(neighbor, grid[finishPos.row][finishPos.col]);
                neighbor.f = neighbor.g + neighbor.h;
                toVisit.enqueue(neighbor);
                distances[neighbor.row][neighbor.col] = neighbor.g + 1;
                paths[neighbor.row][neighbor.col] = (currNode);
            }
        }
    }
    return [visited, []];
}
