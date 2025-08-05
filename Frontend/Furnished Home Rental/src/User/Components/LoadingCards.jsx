import React from "react";
import "../../Styles/ItemsGrid.css";

const LoadingCards = () => {
  const renderLoadingCards = () => {
    return Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="col-md-4">
        <div className="property-card card shadow-sm p-3 mb-4 bg-white rounded loading-card">
          <div className="loading-image"></div>
          <div className="card-body">
            <div className="loading-title"></div>
            <div className="loading-text"></div>
            <div className="loading-text"></div>
            <div className="loading-text"></div>
            <div className="loading-button"></div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">FEATURED PROPERTIES</h2>
      <div className="row">
        {renderLoadingCards()}
      </div>
    </div>
  );
};

export default LoadingCards;
