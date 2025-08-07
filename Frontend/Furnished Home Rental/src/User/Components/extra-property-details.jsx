import React, { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DatePicker, message, Modal, Rate, Avatar, Tooltip, Divider } from "antd";
import {
  FaWifi, FaParking, FaTshirt, FaTv, FaUtensils, FaMugHot, FaBath, FaBed, FaDoorOpen, FaHome, FaToilet, FaMapMarkerAlt, FaUsers, FaCheck, FaStar, FaMapMarker, FaArrowLeft, FaArrowRight
} from "react-icons/fa";
import { UserOutlined } from "@ant-design/icons";
import { createCheckoutSession } from "./API/checkout";
import "../../Styles/property_details.css";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const amenitiesIcons = {
  Wifi: <FaWifi />,
  Parking: <FaParking />,
  Washer: <FaTshirt />,
  TV: <FaTv />,
  Dishwasher: <FaUtensils />,
  Microwave: <FaMugHot />,
  // Add more as needed
};

const PropertyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const property = location.state?.property;

  if (!property) return <div className="container my-5">Property not found.</div>;

  const [dates, setDates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [blockedRanges, setBlockedRanges] = useState([]);

  const nights = useMemo(() => {
    if (dates.length === 2 && dates[0] && dates[1]) {
      const start = dates[0]?.toDate ? dates[0].toDate() : new Date(dates[0]);
      const end = dates[1]?.toDate ? dates[1].toDate() : new Date(dates[1]);
      return Math.max(0, Math.round((end - start) / (1000 * 60 * 60 * 24)));
    }
    return 0;
  }, [dates]);

  const priceDetails = useMemo(() => {
    if (nights > 0) {
      const pricePerNight = Number(property.pricing.pricePerNight);
      const weeklyDiscount = Number(property.pricing.weeklyDiscount) || 0;
      const monthlyDiscount = Number(property.pricing.monthlyDiscount) || 0;
      let total = 0;
      let remainingNights = nights;
      let discountType = null;
      let discountAmount = 0;
      let basePrice = pricePerNight * nights;

      if (remainingNights >= 30 && monthlyDiscount > 0) {
        const months = Math.floor(remainingNights / 30);
        const monthPrice = pricePerNight * 30 * months;
        const monthDiscount = monthPrice * (monthlyDiscount / 100);
        total += monthPrice - monthDiscount;
        discountType = "monthly";
        discountAmount += monthDiscount;
        remainingNights -= months * 30;
      }
      if (remainingNights >= 7 && weeklyDiscount > 0) {
        const weeks = Math.floor(remainingNights / 7);
        const weekPrice = pricePerNight * 7 * weeks;
        const weekDiscount = weekPrice * (weeklyDiscount / 100);
        total += weekDiscount;
        if (!discountType) discountType = "weekly";
        discountAmount += weekDiscount;
        remainingNights -= weeks * 7;
      }
      total += pricePerNight * remainingNights;

      return {
        basePrice,
        discountAmount: Math.round(discountAmount),
        discountType,
        total: Math.round(total),
        pricePerNight,
        nights,
        weeklyDiscount,
        monthlyDiscount,
      };
    }
    return {
      basePrice: 0,
      discountAmount: 0,
      discountType: null,
      total: 0,
      pricePerNight: Number(property.pricing.pricePerNight),
      nights: 0,
      weeklyDiscount: Number(property.pricing.weeklyDiscount) || 0,
      monthlyDiscount: Number(property.pricing.monthlyDiscount) || 0,
    };
  }, [nights, property.pricing.pricePerNight, property.pricing.weeklyDiscount, property.pricing.monthlyDiscount]);

  const handleReserve = async () => {
    if (nights <= 0) {
      message.error("Please select valid check-in and check-out dates.");
      return;
    }
    try {
      // Always pass dates as ISO strings array for consistency
      const selectedDates = [
        dates[0]?.toISOString ? dates[0].toISOString() : dates[0],
        dates[1]?.toISOString ? dates[1].toISOString() : dates[1],
      ];
      const reservationData = {
        propertyId: property._id,
        dates: {
          startDate: selectedDates[0],
          endDate: selectedDates[1],
        },
        guests: guestCount,
        total: priceDetails.total,
        selectedDates, // Add this for summary on checkout page
      };
      const result = await createCheckoutSession(reservationData);
      navigate("/checkout", { state: { clientSecret: result.clientSecret, property, reservationData, priceDetails } });
    } catch (err) {
      message.error("Failed to initiate payment. Please try again.");
    }
  };

  const reviews = property.reviews || [];

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? property.mediaFiles.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === property.mediaFiles.length - 1 ? 0 : prevIndex + 1));
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const imageList = property.mediaFiles && property.mediaFiles.length > 0
    ? property.mediaFiles
    : [{ url: "/default-property.jpg" }];

  // Fetch blocked dates once when the page loads
  useEffect(() => {
    async function fetchBlockedDates() {
      if (property?._id) {
        try {
          console.log("Fetching blocked dates for property:", property._id);
          const res = await fetch(`http://localhost:5000/api/items/list/${property._id}`);
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            console.log("Blocked dates API response:", data);
            // Use only the blockedDates array from the response
            setBlockedRanges(data.blockedDates || []);
          } catch (jsonErr) {
            console.error("Blocked dates API did not return JSON. Raw response:", text);
          }
        } catch (err) {
          console.error("Error fetching blocked dates:", err);
        }
      }
    }
    fetchBlockedDates();
    // eslint-disable-next-line
  }, [property?._id]);

  // Helper to check if a date is blocked
  const isDateBlocked = (date) => {
    const d = dayjs(date).startOf("day");
    if (!d.isValid()) return false;
    return Array.isArray(blockedRanges) && blockedRanges.some(range => {
      const start = dayjs(range.startDate).startOf("day");
      const end = dayjs(range.endDate).startOf("day");
      if (!start.isValid() || !end.isValid()) return false;
      return d.valueOf() >= start.valueOf() && d.valueOf() <= end.valueOf();
    });
  };

  // Prevent selecting a range that includes any blocked date (using timestamps, not dayjs methods)
  const isRangeBlocked = (start, end) => {
    const startTime = dayjs(start).startOf("day").valueOf();
    const endTime = dayjs(end).startOf("day").valueOf();
    if (!startTime || !endTime) return false;
    // Loop through each day in the range
    for (let t = startTime; t <= endTime; t += 24 * 60 * 60 * 1000) {
      if (isDateBlocked(t)) return true;
    }
    return false;
  };

  return (
    <div className="container my-5">
      <div className="row gx-5 gy-4">
        {/* Left: Gallery and Info */}
        <div className="col-lg-7">
          <div className="property-gallery professional-card">
            <div className="carousel-container">
              <img
                src={imageList[currentImageIndex].url}
                alt={`Property image ${currentImageIndex + 1}`}
                className="carousel-image"
                onClick={() => setSelectedImage(imageList[currentImageIndex].url)}
              />
              <div className="carousel-nav">
                <button className="carousel-btn" onClick={goToPrevious}><FaArrowLeft /></button>
                <button className="carousel-btn" onClick={goToNext}><FaArrowRight /></button>
              </div>
            </div>
            <div className="thumbnail-list">
              {imageList.map((file, index) => (
                <img
                  key={index}
                  src={file.url}
                  alt={`Property image ${index + 1}`}
                  className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          </div>

          <div className="property-info professional-card">
            <h1 className="property-title">
              <FaHome className="icon-title" /> {property.listingName}
            </h1>
            <div className="address">
              <FaMapMarkerAlt />
              <a href={`https://www.google.com/maps/place/${encodeURIComponent(property.address.publicAddress)}`} target="_blank" rel="noopener noreferrer">
                {property.address.publicAddress}
              </a>
            </div>
            <Divider />
            <div className="summary-icons">
              <span><FaUsers /> {property.personCapacity} Guests</span>
              <span><FaBed /> {property.numBedrooms} Bedrooms</span>
              <span><FaBath /> {property.numBathrooms} Bathrooms</span>
            </div>
            <Divider />
            <h3 className="section-heading">About this place</h3>
            <p className="description">{property.description}</p>
          </div>

          <div className="amenities-section professional-card">
            <h3 className="section-heading">What this place offers</h3>
            <div className="amenities-grid">
              {property.amenities && property.amenities.length > 0 ? (
                property.amenities.map((amenity, idx) => (
                  <div className="amenity-item" key={idx}>
                    {amenitiesIcons[amenity] || <FaCheck className="icon" />} {amenity}
                  </div>
                ))
              ) : (
                <div className="amenity-item">No amenities listed</div>
              )}
            </div>
          </div>

          <div className="sleeping-arrangements professional-card">
            <h3 className="section-heading">Where you'll sleep</h3>
            <div className="room-list">
              <div>
                <h4>Bedroom 1</h4>
                <div className="bed-list">
                  <div className="bed-item">
                    <FaBed /> 1 Double bed
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="trust-elements professional-card">
            <h3 className="section-heading">Trust & Safety</h3>
            <span className="badge"><FaCheck /> Verified Host</span>
            <p className="notice">Book with confidence. Your safety is our priority.</p>
          </div>

          <div className="reviews-section professional-card">
            <h3 className="section-heading">Reviews</h3>
            <div className="no-reviews">
              <FaStar className="icon" /> No reviews yet
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="col-lg-5">
          <div className="booking-section professional-booking-card sticky-booking-card">
            <div className="booking-header">
              <span className="price">
                <span className="price-amount">${property.pricing.pricePerNight}</span>
                <span className="per-night">/ night</span>
              </span>
              <Rate disabled allowHalf defaultValue={property.rating || 4.5} style={{ fontSize: 16, marginLeft: 8 }} />
            </div>
            <Divider style={{ margin: "12px 0" }} />
            <div className="discount-info">
              {priceDetails.weeklyDiscount > 0 && (
                <div>
                  <span role="img" aria-label="week">📅</span> <b>{priceDetails.weeklyDiscount}% off</b> for weekly stays
                </div>
              )}
              {priceDetails.monthlyDiscount > 0 && (
                <div>
                  <span role="img" aria-label="month">🗓️</span> <b>{priceDetails.monthlyDiscount}% off</b> for monthly stays
                </div>
              )}
            </div>
            <div className="booking-form-fields">
              <label className="booking-label">Select Dates</label>
              <RangePicker
                value={dates}
                onChange={(vals) => {
                  if (
                    vals &&
                    vals.length === 2 &&
                    vals[0] &&
                    vals[1] &&
                    isRangeBlocked(vals[0], vals[1])
                  ) {
                    message.error("Selected range includes blocked dates. Please choose another range.");
                    setDates([]);
                    return;
                  }
                  setDates(vals);
                  // Log selected dates as before
                  console.log("Selected dates:", vals);
                  if (vals && vals.length === 2) {
                    console.log("Selected ISO dates:", [
                      vals[0]?.toISOString ? vals[0].toISOString() : vals[0],
                      vals[1]?.toISOString ? vals[1].toISOString() : vals[1],
                    ]);
                  }
                }}
                className="ant-picker"
                allowClear
                disabledDate={current => {
                  // Block only blocked dates visually
                  return isDateBlocked(current);
                }}
                style={{ width: "100%" }}
              />
              <label className="booking-label" style={{ marginTop: 12 }}>Guests</label>
              <input
                type="number"
                min={1}
                max={property.personCapacity}
                value={guestCount}
                onChange={e => setGuestCount(Number(e.target.value))}
                className="form-control"
                style={{ width: 80 }}
              />
            </div>
            <Divider style={{ margin: "16px 0" }} />
            <div className="price-breakdown">
              <div className="breakdown-row">
                <span>Base price</span>
                <span>${priceDetails.basePrice}</span>
              </div>
              {priceDetails.discountAmount > 0 && (
                <div className="breakdown-row">
                  <span>Discount</span>
                  <span className="discount">-${priceDetails.discountAmount}</span>
                </div>
              )}
              <div className="breakdown-row total">
                <span>Total</span>
                <span>${priceDetails.total}</span>
              </div>
            </div>
            <button className="reserve-btn professional-reserve-btn" onClick={handleReserve}>
              Reserve
            </button>
            <div className="secure-checkout">
              <FaCheck className="secure-icon" /> Secure checkout, instant confirmation
            </div>
          </div>
        </div>
      </div>
      {/* Image Modal */}
      <Modal open={!!selectedImage} footer={null} onCancel={() => setSelectedImage(null)}>
        <img alt="Selected" style={{ width: "100%" }} src={selectedImage} />
      </Modal>
    </div>
  );
};

export default PropertyDetails;