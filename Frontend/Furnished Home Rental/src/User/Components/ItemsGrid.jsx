import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PropertyContext } from "../Context/HomeCardDataContext";
import { fetchProperties } from "../Components/API/HomeCardData";
import "../../Styles/ItemsGrid.css";
import Chatbot from "../../CHATBOT/chatbot";

const ItemsGrid = () => {
  const { properties, setProperties, loading, setLoading } = useContext(PropertyContext);
  const navigate = useNavigate();
  const [ratedProperties, setRatedProperties] = useState({});

  useEffect(() => {
    // Only fetch if properties is empty and not already loading
    if (properties.length === 0 && !loading) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRate = (propertyId) => {
    setRatedProperties((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  // Group properties by their status, but exclude booked properties
  const groupPropertiesByStatus = () => {
    const grouped = {
      featured: [],
      new: [],
      others: []
    };

    properties.forEach(property => {
      if (property.status === 'booked') return; // Exclude booked properties
      if (property.status === 'featured') {
        grouped.featured.push(property);
      } else if (property.status === 'new') {
        grouped.new.push(property);
      } else {
        grouped.others.push(property);
      }
    });

    return grouped;
  };

  const renderPropertyCard = (property) => (
    <div key={property._id} className="col-md-4 d-flex">
      <div className="property-card card shadow-sm mb-4 bg-white rounded flex-fill modern-card">
        <div className="property-image-wrapper">
          <img
            src={property.mediaFiles[0]?.url || "/default-property.jpg"}
            className="card-img-top property-image"
            alt={property.listingName}
            onClick={() => navigate(`/property/${property._id}`, { state: { property } })}
          />
          <span className={`property-status-badge status-${property.status?.toLowerCase() || 'new'}`}>
            {property.status === 'featured' ? '⭐ Featured' : 
             property.status === 'new' ? '🆕 New' : 
             property.status || 'New'}
          </span>
          <i
            className={`rating-heart fas fa-heart ${ratedProperties[property._id] ? "rated" : ""}`}
            onClick={() => handleRate(property._id)}
            title={ratedProperties[property._id] ? "Remove from favorites" : "Add to favorites"}
          ></i>
        </div>
        <div className="property-info">
          <h5 className="property-title">{property.listingName}</h5>
          <p className="property-location">
            <i className="fas fa-map-marker-alt location-icon"></i>
            {property.address.city}, {property.address.state}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="property-price">
              ${property.pricing.pricePerNight} <span className="price-unit">/ night</span>
            </span>
            <button
              className="btn btn-sm btn-primary view-details-btn"
              onClick={() => navigate(`/property/${property._id}`, { state: { property } })}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPropertySection = (title, properties, emptyMessage, statusClass) => {
    if (properties.length === 0) return null;
    
    const isFeaturedSection = statusClass === "featured-section";
    const isCollectionsSection = statusClass === "all-section";
    
    return (
      <div className="property-section">
        <div className={`section-header ${statusClass}`}>
          <div className="section-title">
            <h2>{title}</h2>
            <span className="property-count">{properties.length} properties</span>
          </div>
          
          {isFeaturedSection && (
            <Link to="/featured" className="featured-button-container">
              <button className="featured-button">
                <span>See All Featured Properties</span>
                <div className="button-icon">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </button>
            </Link>
          )}
          {isCollectionsSection && (
            <Link to="/ourcollections" className="featured-button-container">
              <button className="featured-button">
                <span>Explore Our Collections</span>
                <div className="button-icon">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </button>
            </Link>
          )}
        </div>
        <div className="row no-gutters">
          {properties.map(property => renderPropertyCard(property))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid my-5">
        <div className="row no-gutters">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="col-md-4">
              <div className="property-card loading-card">
                <div className="loading-image"></div>
                <div className="loading-title"></div>
                <div className="loading-text"></div>
                <div className="loading-text"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const groupedProperties = groupPropertiesByStatus();

  return (
    <div className="container-fluid my-5">
      {renderPropertySection("Featured Properties", groupedProperties.featured, "No featured properties", "featured-section")}
      {renderPropertySection("New Properties", groupedProperties.new, "No new properties", "new-section")}
      {renderPropertySection("Explore Our Collections", groupedProperties.others, "No properties available", "all-section")}
      <Chatbot />
    </div>
  );
};

export default ItemsGrid;
