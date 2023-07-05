
export default function randomWalls(grid, startPos, finishPos){
    let newGrid = [...grid];
    newGrid.map((row) => 
    row.map((node) => {
        let threshold = Math.random() * 10;
        if (threshold > 7.2 && node.nodeType === "normal")
            node.nodeType = "wall";
        
    }));

    return newGrid;
}
