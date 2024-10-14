import React, { useState } from "react";
import "./correctpercentbar.css";

export const CorrectPercentBar = () => {
    const [correctPercent, setCorrectPercent] = useState(44);
    return (
        <div className="container">
        <div className="progressBar">
            <div className="progressBarFill" style={({width: `${correctPercent}%`})}>
            <div className="progressLabel">{correctPercent}%</div>
            </div>
            
        </div>

    </div>
    );  
};
export default CorrectPercentBar;