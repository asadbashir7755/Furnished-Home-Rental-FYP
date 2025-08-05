import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useVerifyEmail } from "./VerifyEmailContext";
import { Form, Input, Button } from 'antd';
import { sendVerificationEmail, verifyEmail } from "./userAuthApi"; // Import API functions

const VerifyEmail = () => {
  const { formData, setFormData } = useVerifyEmail();
  const location = useLocation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const email = location.state?.email;
    if (email && !emailSent) {
      setFormData({ email });
      sendVerificationEmail(email); // Send verification email when component mounts
      setEmailSent(true);
    }
    console.log("VerifyEmail component mounted with formData:", formData);
    // if (!formData?.email) {
    //   console.log("No email found, redirecting to signup");
    //   navigate("/signup"); // Redirect to signup if no email is found
    // }
  }, [formData, navigate, location.state, setFormData, emailSent]);

  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setCode(value);
      console.log("Updated code:", value);
    }
  };

  const handleVerification = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit verification code.", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
      return;
    }

    setIsVerifying(true);
    const verificationCode = code;

    try {
      console.log("Verifying with code:", verificationCode);
      const response = await verifyEmail(formData, verificationCode);
      if (response.status === 200) {
        toast.success("Verification successful! Redirecting...", {
          position: "top-right",
          autoClose: 2000,
          transition: Slide,
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error("Verification failed. Please try again.", {
          position: "top-right",
          autoClose: 2000,
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        transition: Slide,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    console.log("Close button clicked");
    navigate("/signup");
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1050,
      }}
    >
      <div
        className="p-4 shadow rounded position-relative"
        style={{
          backgroundColor: "#ffffff",
          maxWidth: "400px",
          width: "100%",
        }}
      >
        <button
          className="btn-close position-absolute top-0 end-0 m-2"
          onClick={handleClose}
        ></button>

        <h2 className="text-center mb-4" style={{ color: "#000000" }}>
          Verify Your Email
        </h2>

        {formData?.email ? (
          <p className="text-center mb-4" style={{ color: "#000000" }}>
            A verification code has been sent to <strong>{formData.email}</strong>. Please enter it below.
          </p>
        ) : (
          <p className="text-center text-danger">No email found. Please sign up again.</p>
        )}

        <Form onFinish={handleVerification}>
          <div className="mb-4">
            <Input
              type="text"
              className="form-control text-center"
              style={{
                fontSize: "1.5rem",
                border: "2px solid #ddd",
                borderRadius: "8px",
                color: "#000000", // Change text color to black
                backgroundColor: "#fff", // Change background color
                caretColor: "black", // Set caret color to black
                width: "100%", // Ensure the input takes the full width
                letterSpacing: "0.5rem", // Add spacing between characters
                fontFamily: "monospace", // Use a monospace font
              }}
              value={code}
              maxLength="6"
              onChange={handleChange}
            />
          </div>
          <Button
            type="primary"
            htmlType="submit"
            className="w-100"
            style={{ fontSize: "1.1rem", padding: "10px", backgroundColor: "#FF6F61", border: "none" }}
            disabled={isVerifying || code.length !== 6}
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </Form>

        <p style={styles.redirectText}>
          Not Registered yet?{" "}
          <span
            style={styles.redirectLink}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </span>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
};

const styles = {
  redirectText: {
    marginTop: "20px",
    fontSize: "0.9rem",
    color: "#000000", // Change text color to black
  },
  redirectLink: {
    color: "#FF6F61",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
export default VerifyEmail;
