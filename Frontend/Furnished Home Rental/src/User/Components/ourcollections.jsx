import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProperties } from "./API/HomeCardData";
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./FeaturedProperties.css";

const OurCollections = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadNewProperties = async () => {
      setLoading(true);
      try {
        const allProperties = await fetchProperties();
        // Filter only 'new' properties
        const newProps = allProperties.filter(
          property => property.status === "new"
        );
        setProperties(newProps);
      } catch (error) {
        console.error("Error fetching new properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNewProperties();
  }, []);

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="spinner"></div>
        <p>Loading new collections...</p>
      </div>
    );
  }

  return (
    <div className="featured-properties-container">
      <div className="featured-header">
        <span
          className="back-link"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          <ArrowLeftOutlined /> Back to Home
        </span>
        <h1>Our Collections</h1>
        <p>Discover our latest new properties</p>
      </div>

      {properties.length === 0 ? (
        <div className="no-properties">
          <h3>No new collections available at this time</h3>
          <p>Please check back later or browse our other listings</p>
        </div>
      ) : (
        <div className="featured-grid">
          {properties.map(property => (
            <div key={property._id} className="featured-property-card">
              <div className="featured-image-container">
                <img 
                  src={property.mediaFiles[0]?.url || "/default-property.jpg"} 
                  alt={property.listingName}
                  className="featured-property-image"
                />
                <div className="featured-badge">🆕 New</div>
              </div>
              <div className="featured-property-info">
                <h3>{property.listingName}</h3>
                <p className="featured-location">
                  <i className="fas fa-map-marker-alt"></i> 
                  {property.address.city}, {property.address.state}
                </p>
                <p className="featured-description">
                  {property.description ? (
                    <>
                      {property.description.substring(0, 120)}
                      {property.description.length > 120 ? "..." : ""}
                    </>
                  ) : (
                    "No description available"
                  )}
                </p>
                <div className="featured-price-row">
                  <div className="featured-price">${property.pricing.pricePerNight}<span>/night</span></div>
                  <span
                    className="view-button"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/property/${property._id}`, { state: { property } })}
                  >
                    View Details
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="featured-info">
        <h2>Why Choose Our New Collections?</h2>
        <div className="feature-row">
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Latest Listings</h4>
            <p>Be the first to explore our newest properties on the market</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Modern Amenities</h4>
            <p>All new listings are equipped with up-to-date features and comforts</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Verified Quality</h4>
            <p>Every new property is checked for quality and value</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCollections;
