import React from 'react';
import "./actions.css";

const Actions = ({ onRestart, onFold, onCheck, onRaise }) => {
    return (
        <div className="actions">
            <button onClick={onFold} className='foldBtn'>Fold</button>
            <button onClick={onCheck} className='checkBtn'>Check</button>
            <button onClick={onRaise} className='raiseBtn'>Raise</button>
        </div>
    );
}

export default Actions;
