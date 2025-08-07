import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProperties } from "./API/HomeCardData";
import { ArrowLeftOutlined } from '@ant-design/icons';
import "./FeaturedProperties.css";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProperties = async () => {
      setLoading(true);
      try {
        const allProperties = await fetchProperties();
        // Filter only featured properties
        const featuredProps = allProperties.filter(
          property => property.status === "featured"
        );
        setProperties(featuredProps);
      } catch (error) {
        console.error("Error fetching featured properties:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProperties();
  }, []);

  if (loading) {
    return (
      <div className="featured-loading">
        <div className="spinner"></div>
        <p>Loading featured properties...</p>
      </div>
    );
  }

  return (
    <div className="featured-properties-container">
      <div className="featured-header">
        <Link to="/" className="back-link">
          <ArrowLeftOutlined /> Back to Home
        </Link>
        <h1>Featured Properties</h1>
        <p>Our handpicked selection of premium properties</p>
      </div>

      {properties.length === 0 ? (
        <div className="no-properties">
          <h3>No featured properties available at this time</h3>
          <p>Please check back later or browse our other listings</p>
          <Link to="/" className="btn btn-primary mt-3">
            Return to Home
          </Link>
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
                <div className="featured-badge">⭐ Featured</div>
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
                  <Link to={`/property/${property._id}`} className="view-button">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="featured-info">
        <h2>Why Choose Our Featured Properties?</h2>
        <div className="feature-row">
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Premium Locations</h4>
            <p>Our featured properties are located in the most desirable areas</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Exceptional Quality</h4>
            <p>All featured listings meet our highest standards of quality and comfort</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✓</div>
            <h4>Verified Reviews</h4>
            <p>Properties with consistently positive feedback from our customers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProperties;
