import { useRef, useState, useEffect, useCallback } from "react";
import M from 'materialize-css';
import ToolBar from "./ToolBar.js";
import MyNode from './MyNode.js';
import getEmptyGrid from "./getEmptyGrid.js";
import wallSoundPath from './files/wall_sound.mp3'
import './custom.css';
// pathfinding algorithms
import djikstra from "./algorithms/djikstra.js";
import aStar from "./algorithms/aStar";
import depthFirst from "./algorithms/depthFirst.js";
import breadthFirst from "./algorithms/breadthFirst.js";
import jumpPointSearch from "./algorithms/jumpPointSearch.js";
// maze algorithms
import randomizedPrim from "./algorithms/randomizedPrim.js";
import recursiveDivision from "./algorithms/recursiveDivision.js";
import randomWalls from "./algorithms/randomWalls.js";
import randomWeights from "./algorithms/randomWeights.js";
import randomStair from "./algorithms/randomStair.js";

export default function PathFinder(){
    const windowWidth = useRef(window.innerWidth);
    const windowHeight = useRef(window.innerHeight);
    const mousePressing = useRef("none");
    const startPos = useRef(getPoint(windowWidth, windowHeight, "start"));
    const finishPos = useRef(getPoint(windowWidth, windowHeight, "finish"));
    const [algorithm, setAlgorithm] = useState("none");
    const [status, setStatus] = useState("none");
    const [grid, setGrid] = useState(getEmptyGrid(windowWidth, windowHeight, startPos, finishPos));
    const wallSound = new Audio(wallSoundPath);

    useEffect(() => {
      M.AutoInit();
    }, []);

    const drawNode = useCallback((row, col, nodeType) => {
      if (nodeType === "start" || nodeType === "finish" || nodeType === "visited" || nodeType === "shortestPath") return;
      setGrid(grid => {
        const newGrid = [...grid];
        const newType = (nodeType === "normal") ? "wall" : "normal";
        grid[row][col].nodeType = newType;
        wallSound.play();
        return newGrid;
      });
    }, []);

    const moveNode = (newRow, newCol, moving, nodeType) => {
      if (status === "running") return;
      if (nodeType === "start" || nodeType === "finish" || nodeType === "wall" || nodeType === "weight") return;
      var oldPos;
      if (moving === "start"){
        oldPos = startPos.current;
        startPos.current = {row: newRow, col: newCol};
        
      }
      if (moving === "finish") {
        oldPos = finishPos.current;
        finishPos.current = {row: newRow, col: newCol};
      }
      setGrid(grid => {
        const newGrid = [...grid];
        grid[oldPos.row][oldPos.col].nodeType = "normal";
        grid[newRow][newCol].nodeType = moving;
        return newGrid;
      });
    };

    const handleContextMenu = useCallback((e) => {
      e.preventDefault();
    }, [])

    const handleMouseDown = useCallback((e, row, col, nodeType) => {
      if (status === "running") return;
      e.preventDefault();
      mousePressing.current = nodeType;
      drawNode(row, col, nodeType);
    }, [drawNode, status]);

    const handleMouseUp = useCallback((e) => {
      mousePressing.current = "none";
    }, []);

    const handleMouseEnter = useCallback((e, row, col, nodeType) => {
      if (mousePressing.current === "normal" || mousePressing.current === "wall")
        drawNode(row, col, nodeType);
      else if (mousePressing.current === "start" || mousePressing.current === "finish")
        moveNode(row, col, mousePressing.current, nodeType);
    }, [drawNode]);

    const handleMouseLeave = useCallback((e, row, col, nodeType) => {
      if (mousePressing.current === "start" || mousePressing.current === "finish"){
        moveNode(row, col, mousePressing.current, nodeType);
      }
    }, [drawNode]);

    const handleAlgorithmSelect = (algorithm) => {
      setAlgorithm(algorithm);
    };


    function handleMazeSelect(maze) {
      if (maze === "randomized-prim"){
        randomizedPrim(grid, startPos.current, finishPos.current);
        
      }
      else if (maze === "recursive-division"){
        const newGrid = recursiveDivision(grid, startPos.current, finishPos.current);
        setGrid([...newGrid]);
      }
      else if (maze==="random-wall"){
        const newGrid = randomWalls(grid);
        setGrid([...newGrid]);

      }
      else if (maze==="random-weight"){
        const newGrid = randomWeights(grid);
        setGrid([...newGrid]);

      }
      else if (maze==="random-stair"){
        const newGrid = randomStair(grid, startPos.current, finishPos.current);
        setGrid([...newGrid]);
      }
    };

    const animateVisited = useCallback((visited, path, callback) => {
      let i = 0;
      const intervalId = setInterval(() => {
        setGrid(currGrid => {
          const newGrid = currGrid.map(row => [...row]);
          if (i < visited.length) {
            const node = visited[i];
            if (node.nodeType !== "finish" && node.nodeType !== "start") {
              if (node.nodeType === "weight")
                newGrid[node.row][node.col].nodeType = "visited weight";
              else
                newGrid[node.row][node.col].nodeType = "visited";
            }
            i++;
          } else {
            clearInterval(intervalId);
            if (typeof callback === "function") {
              callback();
            }
            // required for animateShortestPath to run after animateVisited
          }
          return newGrid;
        });
      }, 5);
    }, []);
    
    const animatePrune = useCallback((visited, path, callback) => {
      let i = 0;
      const intervalId = setInterval(() => {
        setGrid(currGrid => {
          const newGrid = currGrid.map(row => [...row]);
          if (i < visited.length) {
            const node = visited[i];
            if (node.nodeType !== "finish" && node.nodeType !== "start") {
                if (path.includes(node)){
                  newGrid[node.row][node.col].nodeType = "visited";
                }
                else{
                  newGrid[node.row][node.col].nodeType = "pruned";
                }
            }
            i++;
          } else {
            clearInterval(intervalId);
            if (typeof callback === "function") {
              callback();
            }
            // required for animateShortestPath to run after animateVisited
          }
          return newGrid;
        });
      }, 5);
    }, []);

    const animateJump = (path) => {
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      var node = document.getElementById("0-0");
      var elementRef = node.getBoundingClientRect();
      const left = elementRef.left;
      const top = elementRef.top;
      var idx = 0;
      var currNodeIndex = path[idx].row + '-' + path[idx].col;
      var currNode = document.getElementById(currNodeIndex);
      while (idx < path.length){
        var startElementRef = currNode.getBoundingClientRect();

        ctx.beginPath();
        ctx.moveTo(startElementRef.x + 12.5, (startElementRef.y - top) + 12.5);

        var finishNodeIndex = path[idx].row + '-' + path[idx].col;
        var finishNode = document.getElementById(finishNodeIndex);
        idx += 1;
        currNode = finishNode;
        var finishElementRef = finishNode.getBoundingClientRect();

        ctx.lineTo(finishElementRef.x + 12.5, (finishElementRef.y - top) + 12.5);
        ctx.stroke();
    };
    }
    const animateShortestPath = useCallback((path) => {
      let i = 0;
      const intervalId = setInterval(() => {
        setGrid(currGrid => {
          const newGrid = currGrid.map(row => [...row]);
          if (i < path.length) {
            const node = path[i];
            if (node.nodeType === "visited weight")
              newGrid[node.row][node.col].nodeType = "shortestPath weight";
            else
              newGrid[node.row][node.col].nodeType = "shortestPath";
            i++;
          } else {
            clearInterval(intervalId);
          }
          return newGrid;
        });
      }, 100);
    }, []);
  
    const handleReset = () => {
      if (status === "running") return;
      const newGrid = getEmptyGrid(windowWidth, windowHeight, startPos, finishPos);
      setGrid([...newGrid]);
    };

    const clearProgress = () => {
      const newGrid = [...grid];
      newGrid.map((row) =>
        row.map((node) => {
          if (node.nodeType === 'visited'
            || node.nodeType === 'shortestPath'
            || node.nodeType === "pruned") {
              node.nodeType = "normal";
              const canvas = document.getElementById("canvas");
              const context = canvas.getContext('2d');
              context.clearRect(0, 0, canvas.width, canvas.height);
          }
        })
      );
      setGrid(newGrid);
    };

    const handleStart = () => {
      if (algorithm === "none") {
        M.toast({html: 'Select an algorithm first!', classes: 'rounded'})
        return;
      }
      setStatus("running");
      clearProgress();
      let visited = [];
      let path = [];
      if (algorithm === "Djikstra") {
        [visited, path] = djikstra(grid, startPos.current, finishPos.current);
      }
      else if(algorithm === "A* Star"){
        [visited, path] = aStar(grid, startPos.current, finishPos.current);
      }
      else if(algorithm === "Depth-First"){
        [visited, path] = depthFirst(grid, startPos.current, finishPos.current);
      }
      else if(algorithm === "Breadth-First"){
        [visited, path] = breadthFirst(grid, startPos.current, finishPos.current);
      }
      else if(algorithm === "Jump-Point"){
        [visited, path] = jumpPointSearch(grid, startPos.current, finishPos.current);
      }

      if (algorithm === "Jump-Point"){
        animatePrune(visited, path, () => {
          animateJump(path);
          setStatus("none");
        });
      }
      
  
      else{
        animateVisited(visited, path, () => {
          animateShortestPath(path);
          setStatus("none");
        });
      }
      if (path.length === 0)
        M.toast({html: 'No path found!', classes: 'rounded'})
    };

    return (
      <>
      <ToolBar status={status}
      handleAlgorithmSelect={handleAlgorithmSelect}
      handleMazeSelect={handleMazeSelect}
      handleReset={handleReset}
      handleStart={handleStart}
       />
      <div className="center">
        <table>
          <tbody>
            {grid.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((item, colIdx) => (
                    <MyNode
                      key={`${rowIdx}-${colIdx}`}
                      row={rowIdx}
                      col={colIdx}
                      nodeType={item.nodeType}
                      handleMouseDown={handleMouseDown}
                      handleMouseUp={handleMouseUp}
                      handleMouseEnter={handleMouseEnter}
                      handleMouseLeave={handleMouseLeave}
                      handleContextMenu={handleContextMenu}
                    />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="canvas-container">
          <canvas id="canvas" width={windowWidth.current} height={windowHeight.current * 0.90}></canvas>
        </div>
      </div>
      </>
    );
}


function getPoint(width, height, nodeType){
  let colNumber = Math.floor(width.current / 25);
  let rowNumber = Math.floor(height.current / 25) * 0.8;
  if (nodeType === "finish")
    return {row: Math.ceil(rowNumber / 2), col: Math.ceil(colNumber / 1.5) }
  else
    return {row: Math.ceil(rowNumber / 2), col: Math.ceil(colNumber / 6) }
}
