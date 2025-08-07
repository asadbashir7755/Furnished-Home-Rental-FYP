import React from "react";
import { FaCheckCircle, FaHome } from "react-icons/fa";

const features = [
  {
    icon: <FaCheckCircle color="#52c41a" size={28} />,
    title: "Verified Listings",
    desc: "All properties are thoroughly verified for your peace of mind.",
    cardColor: "#e6f7ff",
    iconColor: "#52c41a"
  },
  {
    icon: <FaCheckCircle color="#1890ff" size={28} />,
    title: "Real-time Availability",
    desc: "See up-to-date availability and book instantly.",
    cardColor: "#f0f5ff",
    iconColor: "#1890ff"
  },
  {
    icon: <FaCheckCircle color="#faad14" size={28} />,
    title: "Transparent Pricing",
    desc: "No hidden fees. What you see is what you pay.",
    cardColor: "#fffbe6",
    iconColor: "#faad14"
  },
  {
    icon: <FaCheckCircle color="#722ed1" size={28} />,
    title: "Secure Booking & Payment",
    desc: "Your transactions are protected with industry-leading security.",
    cardColor: "#f9f0ff",
    iconColor: "#722ed1"
  }
];

const AboutUs = () => (
  <div style={{
    maxWidth: 1000,
    margin: "40px auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }}>
    <div style={{
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 4px 24px #e3e8ee",
      padding: "40px 32px",
      width: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24 }}>
        <FaHome size={36} color="#1890ff" style={{ marginRight: 16 }} />
        <h1 style={{ fontWeight: 700, fontSize: 32, margin: 0, color: "#222" }}>About Us</h1>
      </div>
      <p style={{ fontSize: 18, color: "#444", marginBottom: 24 }}>
        Welcome to <b>Furnished Home Rental</b>, your trusted platform for finding and booking fully furnished rental homes with ease.
      </p>
      <div style={{ marginBottom: 40 }}>
        <h3 style={{ fontWeight: 600, color: "#1890ff", marginBottom: 18 }}>We aim to simplify your house-hunting experience by offering:</h3>
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 28,
          justifyContent: "center"
        }}>
          {/* First three cards in a row */}
          {features.slice(0, 3).map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: feature.cardColor,
                borderRadius: 14,
                boxShadow: "0 2px 8px #e3e8ee",
                padding: "28px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 220,
                maxWidth: 270,
                minHeight: 180,
                transition: "box-shadow 0.2s",
                border: "1.5px solid #e3e8ee",
                flex: "1 1 220px"
              }}
            >
              <div style={{ marginBottom: 14 }}>
                <FaCheckCircle color={feature.iconColor} size={28} />
              </div>
              <div style={{ fontWeight: 600, fontSize: 19, color: "#222", marginBottom: 8, textAlign: "center" }}>
                {feature.title}
              </div>
              <div style={{ color: "#555", fontSize: 15, textAlign: "center" }}>
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
        {/* Fourth card centered below */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 28
        }}>
          <div
            style={{
              background: features[3].cardColor,
              borderRadius: 14,
              boxShadow: "0 2px 8px #e3e8ee",
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              minWidth: 220,
              maxWidth: 270,
              minHeight: 180,
              transition: "box-shadow 0.2s",
              border: "1.5px solid #e3e8ee"
            }}
          >
            <div style={{ marginBottom: 14 }}>
              <FaCheckCircle color={features[3].iconColor} size={28} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 19, color: "#222", marginBottom: 8, textAlign: "center" }}>
              {features[3].title}
            </div>
            <div style={{ color: "#555", fontSize: 15, textAlign: "center" }}>
              {features[3].desc}
            </div>
          </div>
        </div>
      </div>
      <p style={{ fontSize: 17, color: "#444", marginBottom: 18 }}>
        Whether you're a traveler, a student, or a professional, we connect you with comfortable, ready-to-move-in homes across cities.
      </p>
      <p style={{ fontSize: 17, color: "#444", marginBottom: 0 }}>
        Our mission is to make short-term and long-term renting as effortless as possible — with modern technology, user-friendly interfaces, and dedicated support.
      </p>
    </div>
  </div>
);

export default AboutUs;
