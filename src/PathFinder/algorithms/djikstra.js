import * as utils from './utils.js';

export default function djikstra(grid, startPos, finishPos){
    let [distances, paths] = utils.getInitialDistances(grid, startPos);
    const visited = [];
    const pq = new utils.PriorityQueue((a, b) => distances[a.row][a.col] - distances[b.row][b.col]);
    pq.enqueue(grid[startPos.row][startPos.col]);
    while (!pq.isEmpty()){
        let curr_node = pq.dequeue();
        if (curr_node.row === finishPos.row && curr_node.col === finishPos.col)
            return [visited.slice(1), utils.reconstructPath(paths, startPos, finishPos)];
        for (let neighbor of utils.getNeighbors(grid, curr_node, "normal")){
            if (visited.includes(neighbor) || neighbor.nodeType === "wall") continue;
            let newDistance = distances[curr_node.row][curr_node.col] + neighbor.weight;
            if (newDistance < distances[neighbor.row][neighbor.col]){
                pq.enqueue(neighbor);
                distances[neighbor.row][neighbor.col] = newDistance;
                paths[neighbor.row][neighbor.col] = (curr_node);
            }
        }
        visited.push(curr_node);
    }
    return [visited, []];
}
