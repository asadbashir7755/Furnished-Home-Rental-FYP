import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PropertyContext } from "../Context/HomeCardDataContext";
import { fetchProperties } from "../Components/API/HomeCardData";
import "../../Styles/ItemsGrid.css";

const ItemsGrid = () => {
  const { properties, setProperties, loading, setLoading } = useContext(PropertyContext);
  const navigate = useNavigate();
  const [ratedProperties, setRatedProperties] = useState({});

  useEffect(() => {
    if (properties.length === 0) {
      const getProperties = async () => {
        setLoading(true);
        try {
          const data = await fetchProperties();
          setProperties(data);
        } catch (error) {
          console.error("Error fetching properties:", error);
        } finally {
          setLoading(false);
        }
      };
      getProperties();
    }
  }, []);

  const handleRate = (propertyId) => {
    setRatedProperties((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  return (
    <div className="container-fluid my-5">
      <div className="row no-gutters">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="col-md-4">
                <div className="property-card loading-card">
                  <div className="loading-image"></div>
                  <div className="loading-title"></div>
                  <div className="loading-text"></div>
                  <div className="loading-text"></div>
                </div>
              </div>
            ))
          : properties.map((property) => (
              <div key={property._id} className="col-md-4">
                <div className="property-card card shadow-sm p-3 mb-4 bg-white rounded">
                  <img
                    src={property.mediaFiles[0]?.url}
                    className="card-img-top property-image"
                    alt={property.listingName}
                    onClick={() => navigate(`/property/${property._id}`, { state: { property } })}
                  />
                  <div className="property-info">
                    <div className="d-flex align-items-center">
                      <span className="rating">⭐ {property.rating}</span>
                      <i
                        className={`rating-heart fas fa-heart ${ratedProperties[property._id] ? "rated" : ""}`}
                        onClick={() => handleRate(property._id)}
                      ></i>
                    </div>
                    <h5 className="property-title">{property.listingName}</h5>
                    <p className="property-location">
                      {property.address.city}, {property.address.state}
                    </p>
                    <p className="property-price">${property.pricing.pricePerNight} / night</p>
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default ItemsGrid;
