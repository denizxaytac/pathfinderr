import { useState, useEffect } from "react";
import M from 'materialize-css';


export default function ToolBar({handleAlgorithmSelect, handleMazeSelect, handleStart, handleReset, status}){
    const [buttonState, setButtonState] = useState("");
    const [startText, setStartText] = useState("Start Visualizing");
    const setAlgorithm = (algorithmName) => {
        setStartText("Start " + algorithmName);
        handleAlgorithmSelect(algorithmName) 
    }

    useEffect(() => {
        M.AutoInit();
      }, []);

    useEffect(() => {
        let newState = status === "running" ? "disabled" : "";
        setButtonState(newState);
      }, [status]);

    return (
    <div className="container-full">
        <div className="row center">
        <div className="col s3">
            <a className='dropdown-trigger btn' href='#!' data-target='dropdown1'>Select an algorithm</a>
            <ul id='dropdown1' className='dropdown-content'>
                <li><a onClick={() => setAlgorithm("Djikstra")}>Djikstra</a></li>
                <li><a onClick={() => setAlgorithm("A* Star")}>A* Star</a></li>
                <li><a onClick={() => setAlgorithm("Depth-First")}>Depth-First</a></li>
                <li><a onClick={() => setAlgorithm("Breadth-First")}>Breadth-First</a></li>
                <li><a onClick={() => setAlgorithm("Jump-Point")}>Jump Point</a></li>
            </ul>
        </div>
        <div className="col s3">
            <a className={`waves-effect waves-light btn ${buttonState}`} onClick={handleStart}>{startText}</a>
        </div>
        <div className="col s2">
            <a className={`waves-effect waves-light btn ${buttonState}`} onClick={handleReset}>Clear maze</a>
        </div>
        <div className="col s2">
            <a className={`dropdown-trigger btn ${buttonState}`} href='#!' data-target='dropdown2'>Select maze</a>
                <ul id='dropdown2' className='dropdown-content'>
                    <li><a className={`${buttonState}`} onClick={() => handleMazeSelect("randomized-prim")}>Randomized Prim</a></li>
                    <li><a className={`${buttonState}`} onClick={() => handleMazeSelect("recursive-division")}>Recursive Division</a></li>
                    <li><a className={`${buttonState}`} onClick={() => handleMazeSelect("random-wall")}>Random walls</a></li>
                    <li><a className={`${buttonState}`} onClick={() => handleMazeSelect("random-weight")}>Weight maze</a></li>
                    <li><a className={`${buttonState}`} onClick={() => handleMazeSelect("random-stair")}>Stair maze</a></li>
                </ul>
        </div>
        </div>
    </div>
    
    )
}
