import React, { useState } from "react";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaMapMarkerAlt, FaUsers, FaBed, FaBath, FaCheck, FaCreditCard } from "react-icons/fa";
import "../../Styles/checkout_form.css";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#32325d",
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const EXTRA_GUEST_CHARGE = 10; // $10/night per extra guest

const CheckoutForm = () => {
  const location = useLocation();
  const { property, priceDetails: incomingPriceDetails, reservationData, clientSecret } = location.state || {};

  // Defensive: recalculate extra guest charge if needed
  const personCapacity = property?.personCapacity || 1;
  const guests = reservationData?.guests || 1;
  const nights = incomingPriceDetails?.nights || 0;
  const extraGuests = Math.max(0, guests - personCapacity);
  const extraGuestChargeTotal = extraGuests > 0 ? extraGuests * nights * EXTRA_GUEST_CHARGE : 0;

  // Recalculate total if needed
  const basePrice = incomingPriceDetails?.basePrice || 0;
  const discountAmount = incomingPriceDetails?.discountAmount || 0;
  const total =
    basePrice - discountAmount + extraGuestChargeTotal;

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      setProcessing(false);
      return;
    }

    if (!clientSecret) {
      setError("Payment not initialized. Please try again.");
      setProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardNumberElement);

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
            address: { line1: formData.address },
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
        setProcessing(false);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setSuccess(true);
          setTimeout(() => {
            navigate("/");
          }, 2000); // Redirect after 2 seconds
        }
        setProcessing(false);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  if (!property) return <div className="container my-5">Property not found.</div>;

  return (
    <div className="container my-5">
      <form className="checkout-form" onSubmit={handleSubmit} autoComplete="off">
        <div className="checkout-columns">
          {/* Left: Card-related fields */}
          <div className="checkout-column">
            <h2 className="checkout-title">
              <FaCreditCard style={{ marginRight: 8, color: "#635bff" }} />
              Payment Details
            </h2>
            <div className="section-divider" />
            {/* Card Fields */}
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <div className="input-stripe">
                <CardNumberElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1, marginRight: 8 }}>
                <label htmlFor="expiry">Expiry Date</label>
                <div className="input-stripe">
                  <CardExpiryElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="cvc">CVC</label>
                <div className="input-stripe">
                  <CardCvcElement options={CARD_ELEMENT_OPTIONS} />
                </div>
              </div>
            </div>
            <h4 className="section-subheading">Billing Information</h4>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                autoComplete="name"
                placeholder="Name on card"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                autoComplete="email"
                placeholder="you@email.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Billing Address</label>
              <input
                type="text"
                name="address"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                autoComplete="address-line1"
                placeholder="Street address"
              />
            </div>
            <button
              type="submit"
              disabled={!stripe || processing || success}
              className="reserve-btn professional-reserve-btn"
            >
              {processing ? "Processing..." : "Pay & Reserve"}
            </button>
            <div className="secure-checkout">
              <FaCheck className="secure-icon" /> Secure checkout, instant confirmation
            </div>
            {error && <p className="error-text">{error}</p>}
            {success && (
              <p className="success-text">
                Payment successful. Redirecting to home...
              </p>
            )}
          </div>
          {/* Right: Property/Price Details */}
          <aside className="checkout-column checkout-summary professional-summary-card">
            <div className="summary-header">
              <FaHome className="summary-icon" />
              <div>
                <div className="summary-title">{property.listingName}</div>
                <div className="summary-address">
                  <FaMapMarkerAlt /> {property.address.publicAddress}
                </div>
              </div>
            </div>
            <div className="summary-icons">
              <span><FaUsers /> {reservationData?.guests || 1} Guests</span>
              <span><FaBed /> {property.numBedrooms} Bedrooms</span>
              <span><FaBath /> {property.numBathrooms} Bathrooms</span>
            </div>
            {/* Enhance: subtle divider and spacing */}
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Dates:</span>
              <span>
                {
                  reservationData?.selectedDates
                    ? `${reservationData.selectedDates[0]?.slice(0, 10)} - ${reservationData.selectedDates[1]?.slice(0, 10)}`
                    : reservationData?.dates
                      ? `${reservationData.dates.startDate?.slice(0, 10)} - ${reservationData.dates.endDate?.slice(0, 10)}`
                      : ""
                }
              </span>
            </div>
            <div className="summary-row">
              <span>Price per night:</span>
              <span>${incomingPriceDetails?.pricePerNight}</span>
            </div>
            <div className="summary-row">
              <span>Nights:</span>
              <span>{nights}</span>
            </div>
            <div className="summary-row">
              <span>Base price:</span>
              <span>${basePrice}</span>
            </div>
            {discountAmount > 0 && (
              <div className="summary-row">
                <span>Discount:</span>
                <span className="discount">-${discountAmount}</span>
              </div>
            )}
            {extraGuestChargeTotal > 0 && (
              <>
                <div style={{ color: "#d4380d", marginBottom: 8 }}>
                  You have selected {guests} guests, but the maximum allowed without extra charge is {personCapacity}.<br />
                  An extra charge of ${EXTRA_GUEST_CHARGE}/night per additional guest will be added.
                </div>
                <div className="summary-row">
                  <span>Extra guest charge:</span>
                  <span className="discount">+${extraGuestChargeTotal}</span>
                </div>
              </>
            )}
            <div className="summary-row total">
              <span>Total:</span>
              <span>${total}</span>
            </div>
            <div className="summary-notice">
              <FaCheck className="secure-icon" /> All prices include service fees
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
};



export default CheckoutForm;
