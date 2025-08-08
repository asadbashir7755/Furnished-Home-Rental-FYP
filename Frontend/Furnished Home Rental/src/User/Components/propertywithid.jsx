import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchProperties } from "./API/HomeCardData";
import { FaWifi, FaParking, FaTshirt, FaTv, FaUtensils, FaMugHot, FaBath, FaBed, FaHome, FaMapMarkerAlt, FaUsers, FaCheck, FaStar } from "react-icons/fa";
import { Divider, Rate } from "antd";
import "../../Styles/property_details.css";

const amenitiesIcons = {
  Wifi: <FaWifi />,
  Parking: <FaParking />,
  Washer: <FaTshirt />,
  TV: <FaTv />,
  Dishwasher: <FaUtensils />,
  Microwave: <FaMugHot />,
  // Add more as needed
};

const PropertyWithId = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIdx, setMainImageIdx] = useState(0);

  useEffect(() => {
    fetchProperties().then((all) => {
      const found = all.find((p) => p._id === id || p._id?.$oid === id);
      setProperty(found || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container my-5">Loading property...</div>;
  if (!property) return <div className="container my-5">Property not found.</div>;

  const imageList = property.mediaFiles && property.mediaFiles.length > 0
    ? property.mediaFiles
    : [{ url: "/default-property.jpg" }];

  return (
    <div className="container-fluid px-0" style={{ background: "#f7f7f7", minHeight: "100vh" }}>
      <div className="container py-4 px-2 px-md-4">
        {/* Gallery */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row gap-3">
              <div className="flex-grow-1">
                <div className="rounded shadow-sm overflow-hidden" style={{ background: "#fff" }}>
                  <img
                    src={imageList[mainImageIdx].url}
                    alt="Main"
                    style={{
                      width: "100%",
                      height: "420px",
                      objectFit: "cover",
                      borderRadius: "12px 12px 0 0"
                    }}
                  />
                  <div className="d-flex flex-wrap gap-2 p-2 bg-light">
                    {imageList.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.url}
                        alt={`thumb-${idx}`}
                        style={{
                          width: 80,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: idx === mainImageIdx ? "2px solid #007bff" : "1px solid #ddd",
                          cursor: "pointer",
                          opacity: idx === mainImageIdx ? 1 : 0.7
                        }}
                        onClick={() => setMainImageIdx(idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Sticky summary card */}
              <div className="d-none d-md-block" style={{ minWidth: 340, maxWidth: 370 }}>
                <div className="sticky-top" style={{ top: 90 }}>
                  <div className="shadow-sm rounded p-4 bg-white mb-3">
                    <div className="d-flex align-items-center mb-2">
                      <span className="h4 mb-0 me-2" style={{ color: "#222" }}>
                        ${property.pricing.pricePerNight}
                        <span className="fs-6 text-muted"> / night</span>
                      </span>
                      <Rate disabled allowHalf defaultValue={property.rating || 4.5} style={{ fontSize: 18, marginLeft: 8 }} />
                    </div>
                    <div className="mb-2 text-muted">
                      <FaMapMarkerAlt /> {property.address.publicAddress}
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className="mb-2">
                      <FaUsers /> <b>{property.personCapacity}</b> Guests &nbsp;
                      <FaBed /> <b>{property.numBedrooms}</b> Bedrooms &nbsp;
                      <FaBath /> <b>{property.numBathrooms}</b> Baths
                    </div>
                    <div className="mb-2">
                      {property.pricing.weeklyDiscount > 0 && (
                        <span className="badge bg-info text-dark me-2">
                          📅 {property.pricing.weeklyDiscount}% off weekly
                        </span>
                      )}
                      {property.pricing.monthlyDiscount > 0 && (
                        <span className="badge bg-info text-dark">
                          🗓️ {property.pricing.monthlyDiscount}% off monthly
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shadow-sm rounded p-3 bg-white">
                    <div className="mb-2">
                      <span className="badge bg-success"><FaCheck /> Verified Host</span>
                    </div>
                    <div className="text-muted small">Book with confidence. Your safety is our priority.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className="row">
          <div className="col-lg-8">
            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h2 className="mb-2" style={{ fontWeight: 600 }}>
                <FaHome className="icon-title" /> {property.listingName}
              </h2>
              <div className="mb-2 text-muted">
                <FaMapMarkerAlt />{" "}
                <a href={`https://www.google.com/maps/place/${encodeURIComponent(property.address.publicAddress)}`} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
                  {property.address.publicAddress}
                </a>
              </div>
              <Divider />
              <div className="mb-3">
                <span className="me-3"><FaUsers /> {property.personCapacity} Guests</span>
                <span className="me-3"><FaBed /> {property.numBedrooms} Bedrooms</span>
                <span><FaBath /> {property.numBathrooms} Bathrooms</span>
              </div>
              <Divider />
              <h4 className="mb-2" style={{ fontWeight: 500 }}>About this place</h4>
              <p className="description">{property.description}</p>
            </div>

            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h4 className="mb-3" style={{ fontWeight: 500 }}>What this place offers</h4>
              <div className="row">
                {property.amenities && property.amenities.length > 0 ? (
                  property.amenities.map((amenity, idx) => (
                    <div className="col-6 col-md-4 mb-2" key={idx}>
                      <span className="me-2">{amenitiesIcons[amenity] || <FaCheck className="icon" />}</span>
                      {amenity}
                    </div>
                  ))
                ) : (
                  <div className="col-12">No amenities listed</div>
                )}
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h4 className="mb-3" style={{ fontWeight: 500 }}>Where you'll sleep</h4>
              <div>
                <FaBed /> Bedroom 1: 1 Double bed
              </div>
            </div>

            <div className="bg-white rounded shadow-sm p-4 mb-4">
              <h4 className="mb-3" style={{ fontWeight: 500 }}>Reviews</h4>
              <div className="no-reviews text-muted">
                <FaStar className="icon" /> No reviews yet
              </div>
            </div>
          </div>
          {/* Sticky summary card for mobile */}
          <div className="col-lg-4 d-block d-md-none mb-4">
            <div className="shadow-sm rounded p-4 bg-white mb-3">
              <div className="d-flex align-items-center mb-2">
                <span className="h4 mb-0 me-2" style={{ color: "#222" }}>
                  ${property.pricing.pricePerNight}
                  <span className="fs-6 text-muted"> / night</span>
                </span>
                <Rate disabled allowHalf defaultValue={property.rating || 4.5} style={{ fontSize: 18, marginLeft: 8 }} />
              </div>
              <div className="mb-2 text-muted">
                <FaMapMarkerAlt /> {property.address.publicAddress}
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className="mb-2">
                <FaUsers /> <b>{property.personCapacity}</b> Guests &nbsp;
                <FaBed /> <b>{property.numBedrooms}</b> Bedrooms &nbsp;
                <FaBath /> <b>{property.numBathrooms}</b> Baths
              </div>
              <div className="mb-2">
                {property.pricing.weeklyDiscount > 0 && (
                  <span className="badge bg-info text-dark me-2">
                    📅 {property.pricing.weeklyDiscount}% off weekly
                  </span>
                )}
                {property.pricing.monthlyDiscount > 0 && (
                  <span className="badge bg-info text-dark">
                    🗓️ {property.pricing.monthlyDiscount}% off monthly
                  </span>
                )}
              </div>
            </div>
            <div className="shadow-sm rounded p-3 bg-white">
              <div className="mb-2">
                <span className="badge bg-success"><FaCheck /> Verified Host</span>
              </div>
              <div className="text-muted small">Book with confidence. Your safety is our priority.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyWithId;
