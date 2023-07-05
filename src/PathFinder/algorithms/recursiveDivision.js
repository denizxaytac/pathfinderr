
const MINIMUM_SIZE = 5;

var horizontalWalls = [];
var verticalWalls = [];


export default function recursiveDivision(grid, startPos, finishPos){
    let mazeHeight = grid.length;
    let mazeWidth = grid[0].length;
    //console.log("maze", mazeWidth, mazeHeight);
    divide(grid, 0, 0, mazeHeight - 1, mazeWidth - 1, 0);
    // horizontalWalls = arrayRange(0, mazeHeight - 1, 1);
    // verticalWalls = arrayRange(0, mazeWidth -, 1);
    console.log(horizontalWalls, verticalWalls);
    return grid;
}

function divide(grid, x1, y1, x2, y2, idx){
    // if (idx === 3)
    // return;
    var dx = x2 - x1;
    var dy = y2 - y1;
    // return if the section is too small to divide
    if (dx < MINIMUM_SIZE || dy < MINIMUM_SIZE) {
        return;
    }

    let wallOrientation = idx % 2 == 0 ? "horizontal" : "vertical";

    var randomX = randomRange(x1, x2, wallOrientation);
    var randomY = randomRange(y1, y2, wallOrientation);

    //console.log("idx:", idx,"\n", "x1:", x1, "y1:", y1,"\n", "x2:", x2,"y2:", y2, "\n", "randomX=>", randomX, "randomY=>", randomY, "wall->", wallOrientation);
    if (wallOrientation === "horizontal"){
        createHorizontalWall(grid, randomX, y1, y2);
        divide(grid, x1, y1, randomX, y2, idx + 1); // upper side of the wall
        divide(grid, randomX, y1, x2, y2, idx + 1); // lower side of the wall
    }
    else{
        createVerticalWall(grid, x1, randomY, x2);
        divide(grid, x1, y1, x2, randomY, idx + 1); // left side of the wall
        divide(grid, x1, randomY, x2, y2, idx + 1); // right side of the wall
    }

}


function randomRange(min, max, orientation) {
    //const doNotChoose = (orientation === "horizontal") ? horizontalWalls : verticalWalls;
    var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomNumber;
    
}

function createHorizontalWall(grid, xPos, startY, length){
    for (let newY = startY; newY <= length; newY++){
        if (grid[xPos][newY].nodeType === "normal")
        grid[xPos][newY].nodeType = "wall";
    }
}

function createVerticalWall(grid, startX, yPos, length){
    for (let newX = startX; newX <= length; newX++){
        if (grid[newX][yPos].nodeType === "normal")
        grid[newX][yPos].nodeType = "wall";
    }
    grid[randomRange(startX, length)][yPos].nodeType = "normal";
}
  
