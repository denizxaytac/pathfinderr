import * as utils from './utils.js';

const MINIMUM_SIZE = 2;

var verticalDoors = [];
var horizontalDoors = [];

export default function recursiveDivision(grid, startPos, finishPos){
    let mazeHeight = grid.length;
    let mazeWidth = grid[0].length;
    divide(grid, 0, 0, mazeHeight - 1, mazeWidth - 1, 0);
    return grid;
}

function divide(grid, x1, y1, x2, y2, idx){
    var dx = x2 - x1; // chamber length
    var dy = y2 - y1; // chamber width
    // return if the section is too small to divide
    if (dx < MINIMUM_SIZE || dy < MINIMUM_SIZE) {
        return;
    }

    let wallOrientation;
    if (dx > dy) wallOrientation = "horizontal";
    else wallOrientation = "vertical";
    var randomX = getWallPosition(x1, x2, wallOrientation);
    var randomY = getWallPosition(y1, y2, wallOrientation);
    //console.log("idx:", idx,"\n", "x1:", x1, "y1:", y1,"\n", "x2:", x2,"y2:", y2, "\n", "randomX=>", randomX, "randomY=>", randomY, "wall->", wallOrientation, "vertical doors", verticalDoors, "horizontal doors", horizontalDoors);
    if (wallOrientation === "horizontal"){
        if (!hasAdjacentWall(grid, randomX, randomY, wallOrientation, y1, y2))
            createHorizontalWall(grid, randomX, y1, y2);
        divide(grid, x1, y1, randomX - 1, y2, idx + 1); // upper side of the wall
        divide(grid, randomX + 1, y1, x2, y2, idx + 1); // lower side of the wall
    }
    else{
        if (!hasAdjacentWall(grid, randomX, randomY, wallOrientation, x1, x2))
            createVerticalWall(grid, x1, randomY, x2);
        divide(grid, x1, y1, x2, randomY - 1, idx + 1); // left side of the wall
        divide(grid, x1, randomY + 1, x2, y2, idx + 1); // right side of the wall
    }

}

function getWallPosition(min, max, orientation) {
    let array = utils.createArrayRange(min, max, 1);
    if (orientation === "horizontal"){
        for (let element in verticalDoors){
            array.splice(array.indexOf(element), 1);
        }
        if (array.length > 0)
        return array.splice(Math.floor(Math.random() * array.length), 1)[0];
    }
    if (orientation === "vertical"){
        for (let element in horizontalDoors){
            array.splice(array.indexOf(element), 1);
        }
        if (array.length > 0)
        return array.splice(Math.floor(Math.random() * array.length), 1)[0];
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;  
}

function createHorizontalWall(grid, xPos, startY, length){
    for (let newY = startY; newY <= length; newY++){
        if (grid[xPos][newY].nodeType === "normal" && !(utils.check2DArrayContains(verticalDoors, [xPos, newY + 1]) || utils.check2DArrayContains(verticalDoors, [xPos, newY - 1])))
        grid[xPos][newY].nodeType = "wall";
    }
    let randomIdx = utils.randomRange(startY, length);
    grid[xPos][randomIdx].nodeType = "normal";
    horizontalDoors.push([xPos, randomIdx]);
}

function createVerticalWall(grid, startX, yPos, length){
    for (let newX = startX; newX <= length; newX++){
        if (grid[newX][yPos].nodeType === "normal" && !(utils.check2DArrayContains(horizontalDoors, [newX + 1, yPos]) || utils.check2DArrayContains(horizontalDoors, [newX - 1, yPos])))
        grid[newX][yPos].nodeType = "wall";
    }
    let randomIdx = utils.randomRange(startX, length)
    grid[randomIdx][yPos].nodeType = "normal";
    verticalDoors.push([randomIdx, yPos]);
}
  
function hasAdjacentWall(grid, randomX, randomY, orientation, wallStartPos, wallEndPos){
    if (orientation === "vertical"){
        for (let xPos = wallStartPos; xPos < wallEndPos; xPos++){
            if (grid[xPos][randomY + 1]?.nodeType === "wall" || (randomY != 0 && grid[xPos][randomY - 1].nodeType == "wall"))
                return true;
        }
    }
    if (orientation === "horizontal"){
        for (let yPos = wallStartPos; yPos <= wallEndPos; yPos++){
            if (grid[randomX + 1]?.[yPos].nodeType === "wall" || (randomX != 0 && grid[randomX - 1][yPos].nodeType == "wall"))
                return true;
        }
    }
    return false;
}

