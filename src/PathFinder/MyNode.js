import './custom.css';
import React from 'react';

function MyNode({row, col, nodeType, handleMouseDown, handleMouseUp, handleMouseEnter, handleMouseLeave, handleContextMenu}){
    return <td
    id ={`${row}-${col}`} 
    className={`node ${nodeType}`} 
    onMouseDown={e => handleMouseDown(e, row, col, nodeType)}
    onMouseUp={e => handleMouseUp(e)}
    onMouseEnter={e => handleMouseEnter(e, row, col, nodeType)}
    onMouseLeave={e => handleMouseLeave(e, row, col, nodeType)}
    onContextMenu={e => handleContextMenu(e)}
    ></td>
}

export default React.memo(MyNode);
