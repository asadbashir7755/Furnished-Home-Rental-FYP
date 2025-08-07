import React, { useState } from 'react';
import { submitContactForm } from './API/Contactus';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaUser, FaCommentDots, FaRegPaperPlane } from "react-icons/fa";
import "../../Styles/Contactus.css"

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const response = await submitContactForm(formData);
    if (response.success) {
      setShowSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: ''
      });
    } else {
      // Show error as before (optional: you can use a toast or inline error)
      alert('Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{
      minHeight: "90vh",
      background: "linear-gradient(135deg, #f6f8fa 60%, #e3e8ee 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 0"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 32px #e3e8ee",
        padding: "48px 40px",
        width: "100%",
        maxWidth: 900,
        display: "flex",
        gap: 40,
        flexWrap: "wrap",
        alignItems: "stretch"
      }}>
        {/* Left: Contact Info */}
        <div style={{
          flex: "1 1 320px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          borderRight: "1.5px solid #f0f0f0",
          paddingRight: 32,
          marginBottom: 0
        }}>
          <h2 style={{ fontWeight: 700, color: "#1890ff", marginBottom: 18, display: "flex", alignItems: "center" }}>
            <FaEnvelope style={{ marginRight: 12, color: "#1890ff" }} />
            Contact Us
          </h2>
          <p style={{ color: "#444", fontSize: 17, marginBottom: 24 }}>
            We'd love to hear from you! Whether you have a question, feedback, or need help, our team is here for you.
          </p>
          <div style={{ marginBottom: 16, fontSize: 16, color: "#333", display: "flex", alignItems: "center" }}>
            <FaEnvelope style={{ marginRight: 10, color: "#52c41a" }} />
            <span>
              <b>Email:</b> <a href="mailto:asadbashir2229526@gmail.com" style={{ color: "#1890ff" }}>asadbashir2229526@gmail.com</a>
            </span>
          </div>
          <div style={{ marginBottom: 16, fontSize: 16, color: "#333", display: "flex", alignItems: "center" }}>
            <FaPhoneAlt style={{ marginRight: 10, color: "#52c41a" }} />
            <span>
              <b>Phone:</b> 03400569133
            </span>
          </div>
          <div style={{ marginBottom: 16, fontSize: 16, color: "#333", display: "flex", alignItems: "center" }}>
            <FaMapMarkerAlt style={{ marginRight: 10, color: "#52c41a" }} />
            <span>
              <b>Location:</b> Muzaffarabad, AJK, Pakistan
            </span>
          </div>
          <div style={{
            marginTop: 24,
            background: "#f7f9fb",
            borderRadius: 10,
            padding: "18px 16px",
            color: "#1890ff",
            fontWeight: 500,
            fontSize: 15,
            boxShadow: "0 2px 8px #e3e8ee"
          }}>
            <FaRegPaperPlane style={{ marginRight: 8 }} />
            Office Hours: <span style={{ color: "#444", fontWeight: 400 }}>Monday - Saturday, 9:00 AM – 6:00 PM</span>
          </div>
        </div>
        {/* Right: Contact Form */}
        <div style={{
          flex: "1 1 340px",
          paddingLeft: 32,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}>
          {showSuccess ? (
            <div style={{
              background: "#f6ffed",
              border: "1.5px solid #b7eb8f",
              borderRadius: 10,
              padding: "32px 24px",
              color: "#389e0d",
              fontWeight: 500,
              fontSize: 18,
              textAlign: "center",
              boxShadow: "0 2px 8px #e3e8ee"
            }}>
              <FaRegPaperPlane style={{ fontSize: 32, marginBottom: 12 }} />
              <div style={{ marginBottom: 8 }}>Thank you for reaching out!</div>
              <div>We have received your message and will get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500, color: "#222" }}>
                    <FaUser style={{ marginRight: 6 }} />First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="First Name"
                    style={{ borderRadius: 8, marginTop: 4 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500, color: "#222" }}>
                    <FaUser style={{ marginRight: 6 }} />Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Last Name"
                    style={{ borderRadius: 8, marginTop: 4 }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500, color: "#222" }}>
                    <FaPhoneAlt style={{ marginRight: 6 }} />Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Phone Number"
                    style={{ borderRadius: 8, marginTop: 4 }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontWeight: 500, color: "#222" }}>
                    <FaEnvelope style={{ marginRight: 6 }} />Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    style={{ borderRadius: 8, marginTop: 4 }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontWeight: 500, color: "#222" }}>
                  <FaCommentDots style={{ marginRight: 6 }} />Message
                </label>
                <textarea
                  className="form-control"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                  rows={4}
                  style={{ borderRadius: 8, marginTop: 4 }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: "100%",
                  fontWeight: 600,
                  fontSize: 18,
                  marginTop: 10,
                  background: "#1890ff",
                  border: "none",
                  borderRadius: 8,
                  padding: "12px 0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                disabled={submitting}
              >
                <FaRegPaperPlane style={{ marginRight: 8 }} />
                {submitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contactus;
