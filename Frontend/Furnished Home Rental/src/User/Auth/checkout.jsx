import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";

// Get Stripe publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const location = useLocation();
  const clientSecret = location.state?.clientSecret;

  useEffect(() => {
    // Debug: log clientSecret to verify it's being passed correctly
    console.log("Checkout page received clientSecret:", clientSecret);
  }, [clientSecret]);

  const containerStyle = {
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f9fa",
    padding: "20px",
  };

  if (!clientSecret) {
    return (
      <div style={containerStyle}>
        <div style={{ color: "#dc3545", textAlign: "center", background: "#fff", padding: "30px", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
          <h2>Payment Error</h2>
          <p>No payment session found.</p>
          <p style={{ color: "#6c757d", fontSize: "14px" }}>
            Please return to the property page and click "Reserve" to start a new payment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm {...location.state} />
      </Elements>
    </div>
  );
};

export default Checkout;
