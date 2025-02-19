import React from "react";
import "./Background.css";

const Background = () => {
  return (
    <div className="background">
      <div className="bg-blur-overlay"></div>
      <div className="circle-container">
        <div className="circle circle-1 animate-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3 animate-2"></div>
        <div className="circle circle-4 "></div>
      </div>
    </div>
  );
};

export default Background;
