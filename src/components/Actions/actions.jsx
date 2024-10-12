// src/components/ActionButtons.jsx
import React from 'react';
import "./actions.css";


const Actions = () => (
  <div className="actions">
    <button className='actionBtn'>Fold</button>
    <button className='actionBtn'>Check</button>
    <button className='actionBtn'>Raise</button>
  </div>
);
export default Actions;