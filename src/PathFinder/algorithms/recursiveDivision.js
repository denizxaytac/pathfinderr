
const MINIMUM_SIZE = 3;

var horizontalWalls = [];
var verticalWalls = [];

export default function recursiveDivision(grid, startPos, finishPos){
    let mazeHeight = grid.length;
    let mazeWidth = grid[0].length;
    console.log("maze", mazeWidth, mazeHeight);
    division(grid, 0, 0, mazeWidth, mazeHeight, "vertical", 0);
    return grid;
}

function division(grid, x, y, width, height, orientation, idx){
    // if (idx === 5) return;
    if (width <= MINIMUM_SIZE || height <= MINIMUM_SIZE) return;
    if (orientation === "horizontal") {
        let randomX = Math.floor(Math.random() * (height - 1)) + x;
        while (horizontalWalls.includes(randomX - 1) || horizontalWalls.includes(randomX + 1)){
            randomX = Math.floor(Math.random() * (height - 1)) + x;
            console.log("generated X: ", randomX);
        }
        horizontalWalls.push(randomX);
        console.log("Index: ", idx, "x: ", x, "y: ", y, "width: ", width, "height: ",  height, orientation, "randomX: ", randomX);
        createHorizontalWall(grid, randomX, y, width);
        let randomY = Math.floor(Math.random() * (width - 1)) + y;
        grid[randomX][randomY].nodeType = "normal";
        division(grid, x, y, width, (randomX - x), getNewOrientation(width, (randomX - x), orientation), idx + 1);
        division(grid, randomX + 1, y, width, (height - randomX - 1), getNewOrientation(width, (height - randomX - 1), orientation), idx + 1);
    }
    else if (orientation === "vertical"){
        let randomY = Math.floor(Math.random() * (width - 1)) + y;
        while (verticalWalls.includes(randomY - 1) || verticalWalls.includes(randomY + 1)){
            randomY = Math.floor(Math.random() * (width - 1)) + y;
            console.log("generated Y: ", randomY);
        }
        verticalWalls.push(randomY);
        // if (idx === 0) randomY = 30;
        console.log("Index: ", idx, "x: ", x, "y: ", y, "width: ", width, "height: ",  height, orientation, "randomY: ", randomY);
        createVerticalWall(grid, x, randomY, height);
        let randomX = Math.floor(Math.random() * (height - 1)) + x;
        grid[randomX][randomY].nodeType = "normal";
        division(grid, x, y, (randomY - y), height,  getNewOrientation((randomY - y), height, orientation), idx + 1);
        division(grid, x, randomY + 1, (width - randomY - 1), height, getNewOrientation((width - randomY - 1), height, orientation), idx + 1);
    }
}
function createHorizontalWall(grid, defaultX, startY, length){
    // if (startY + length > grid[0].length) length = length - 1;
    for (let newY = startY; newY < startY + length; newY++){
        if (grid[defaultX][newY].nodeType === "normal")
        grid[defaultX][newY].nodeType = "wall";
    }
}

function createVerticalWall(grid, startX, defaultY, length){
    // if (startX + length > grid.length) length = length - 1;
    for (let newX = startX; newX < startX + length; newX++){
        if (grid[newX][defaultY].nodeType === "normal")
        grid[newX][defaultY].nodeType = "wall";
    }
}



function getNewOrientation(width, height, orientation) {
        if (orientation === "horizontal")
        return "vertical";
    return "horizontal";

    if (width < height) {
      return "horizontal";
    } else if (height < width) {
      return "vertical";
    } else {
      let orientations = ["horizontal", "vertical"];
      return orientations[Math.floor(Math.random() * orientations.length)];
    }
  }
  