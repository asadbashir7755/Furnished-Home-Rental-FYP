import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../../Styles/LoginPage.css"; // Reuse the same styles as LoginPage
import { useVerifyEmail } from "./VerifyEmailContext";
import { registerUser } from "./userAuthApi";
import signupImage from "../../assets/login1.jpg"; // Add a signup image if available

const styles = {
  loginRight: {
    height: "100%",
    overflowY: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: "gray #f0f0f0",
  },
  loginRightSmall: {
    overflowY: "visible",
  },
};

const Signup = () => {
  const { setFormData } = useVerifyEmail();
  const [localFormData, setLocalFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData({ ...localFormData, [name]: value });
  };

  const validatePhoneNumber = (phone) => /^[0-9]{7,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localFormData.password !== localFormData.confirmPassword) {
      toast.error("Passwords do not match!", { position: "top-right", autoClose: 1000, transition: Slide });
      return;
    }

    if (localFormData.password.length < 8) {
      toast.error("Password must be at least 8 characters long!", { position: "top-right", autoClose: 1000, transition: Slide });
      return;
    }

    if (!validatePhoneNumber(localFormData.phone)) {
      toast.error("Invalid phone number!", { position: "top-right", autoClose: 1000, transition: Slide });
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser(localFormData);
      if (response.status === 201) {
        toast.success("Account created successfully!", { position: "top-right", autoClose: 5000, transition: Slide });
        setFormData(localFormData);
        navigate("/verify", { state: { email: localFormData.email } });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      toast.error(errorMessage, { position: "top-right", autoClose: 1000, transition: Slide });
    } finally {
      setIsLoading(false);
    }
  };

  const isSmallDevice = window.innerWidth <= 768;

  return (
    <div className="login-page">
      <div className="login-container row mx-0" style={{ height: "100vh", overflow: "hidden" }}> {/* Fixed height for the container */}
        <div className="login-left col-md-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ height: "100%" }}> {/* Fixed height for the image container */}
          <h2>Welcome</h2>
          <p>Create an account to explore our services.</p>
          <img src={signupImage} alt="Signup" className="login-image img-fluid" style={{ height: "100%", width: "100%", objectFit: "cover" }} />
        </div>
        <div
          className="login-right col-md-7 d-flex align-items-center justify-content-center"
          style={isSmallDevice ? styles.loginRightSmall : styles.loginRight}
        >
          <div className="login-form bg-light p-4 rounded shadow w-100" style={{ maxWidth: "500px", paddingTop: "30px" }}>
            
            <div className="signup-form-container">
    
              <form className="signup-form" onSubmit={handleSubmit}>
              <div style={{marginBottom:"0px" }} > {/* Reduced margin to decrease space */}
              <h3 className="text-center" style={{ color: "#495057" }}>Sign Up</h3>
            </div>
                <div style={{marginTop:"0px",paddingTop:"0px" }}  className="mb-4"> {/* Enhanced input styling */}
                  <label htmlFor="username" className="form-label" style={{ fontWeight: "500", fontSize: "14px" }}>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={localFormData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    minLength="3"
                    style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={localFormData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={localFormData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={localFormData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    pattern="^[0-9]{7,15}$"
                    title="Please enter a valid phone number (7-15 digits)."
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    value={localFormData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    minLength="8"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "70%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={localFormData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    minLength="8"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      top: "70%",
                      right: "10px",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                    }}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "#495057", border: "none" }}
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </button>
                <div className="text-center mt-3">
                  <div className="divider-line">
                    <span className="divider-text">or</span>
                  </div>
                  <p className="mt-3">Already have an account? <Link to="/login" style={{ color: "#FF6F61" }}>Log In</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;