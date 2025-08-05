import React from "react";
import "../../Styles/LoadingComponent.css";

const LoadingComponent = () => {
  return (
    <div className="loading-container">
      <div className="loading-navbar"></div>
      <div className="loading-hero"></div>
      <div className="loading-items-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="loading-card">
            <div className="loading-image"></div>
            <div className="loading-title"></div>
            <div className="loading-text"></div>
            <div className="loading-text"></div>
            <div className="loading-text"></div>
            <div className="loading-button"></div>
          </div>
        ))}
      </div>
      <div className="loading-footer"></div>
    </div>
  );
};

export default LoadingComponent;
