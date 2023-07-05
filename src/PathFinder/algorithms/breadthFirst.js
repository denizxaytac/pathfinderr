import * as utils from './utils.js';

export default function breadthFirst(grid, startPos, finishPos){
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    const visited = [];
    const toVisit = [];
    toVisit.push(grid[startPos.row][startPos.col]);
    visited.push(grid[startPos.row][startPos.col]);
    distances[startPos.row][startPos.col] = 0;
    while (toVisit.length > 0){
        let curr_node = toVisit.shift();
        if (curr_node.row === finishPos.row && curr_node.col === finishPos.col)
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        for (let neighbor of utils.getNeighbors(grid, curr_node, "normal")){
            if (visited.includes(neighbor) || neighbor.nodeType === "wall") continue;
            distances[neighbor.row][neighbor.col] = distances[curr_node.row][curr_node.col] + 1;
            paths[neighbor.row][neighbor.col] = (curr_node);
            toVisit.push(neighbor);
            visited.push(neighbor);
        }

    }
    return [visited, []];
}
