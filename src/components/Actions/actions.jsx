// Currently does nothing.. Not even super sure how to make it do something.

import React from 'react';
import "./actions.css";


const Actions =  ({onRestart}) => {
  return (
  <div className="actions">
    <button onClick={onRestart}className='foldBtn'>Fold</button>
    <button className='checkBtn'>Check</button>
    <button className='raiseBtn'>Raise</button>
  </div>
);
}

export default Actions;