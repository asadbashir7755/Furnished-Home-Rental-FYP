import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../../Styles/SignupPage.css"; // Correct path for the CSS file
import VerifyEmail from "./verifyEmail";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import countryList from 'react-select-country-list';
import phoneCodes from 'country-telephone-data';
import { useVerifyEmail } from "./VerifyEmailContext";
import { registerUser } from "./userAuthApi"; // Import API functions

const Signup = () => {
  const { setFormData } = useVerifyEmail();
  const [localFormData, setLocalFormData] = useState({ username: '', name: '', email: '', phone: '', country: '', countryCode: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);
  const navigate = useNavigate();
  const countries = countryList().getData();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...localFormData, [name]: value };
    setLocalFormData(updatedFormData);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = countries.find(country => country.label === e.target.value);
    if (selectedCountry) {
      const countryCode = phoneCodes.allCountries.find(code => code.name === selectedCountry.label)?.dialCode || selectedCountry.value;
      if (countryCode) {
        const updatedFormData = { ...localFormData, country: selectedCountry.label, countryCode };
        setLocalFormData(updatedFormData);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (localFormData.password !== localFormData.confirmPassword) {
      toast.dismiss();
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 1000,
        transition: Slide,
      });
      return;
    }

    if (localFormData.password.length < 8) {
      toast.dismiss();
      toast.error("Password must be at least 8 characters long!", {
        position: "top-right",
        autoClose: 1000,
        transition: Slide,
      });
      return;
    }

    try {
      const response = await registerUser(localFormData);
      console.log("sending data")
      if (response.status === 201) {
        console.log("send data successful")
        toast.dismiss();
        toast.success("Account created successfully!", {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        });

        setFormData(localFormData);
        setShowVerifyEmail(true);
        console.log(localFormData);

        // Only navigate if formData contains an email
        if (localFormData.email) {
          navigate("/verify", { state: { email: localFormData.email } });
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong!";
      if (errorMessage.includes("E11000 duplicate key error")) {
        toast.dismiss();
        toast.error("Username already exists. Please choose a different username.", {
          position: "top-right",
          autoClose: 1000,
          transition: Slide,
        });
      } else {
        console.error("Error details:", errorMessage);
        toast.dismiss();
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 1000,
          transition: Slide,
        });
      }
    }
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{7,15}$/;
    return phoneRegex.test(phone);
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-form bg-light p-4 rounded shadow">
          <h2 className="text-center mb-2" style={{ color: "#FF6F61" }}>Welcome</h2>
          <h3 className="text-center mb-4 " style={{ color: "#FF6F61" }}>Create an Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={localFormData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
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
                  <div className="input-group">
                    <select
                      className="form-control country-code"
                      id="country"
                      name="country"
                      value={localFormData.country}
                      onChange={handleCountryChange}
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.label}>
                          {country.label}
                        </option>
                      ))}
                    </select>
                    <div className="input-group-prepend">
                      <span className="input-group-text">+{localFormData.countryCode}</span>
                    </div>
                    <input
                      type="tel"
                      className="form-control phone-number"
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
                </div>
              </div>
              <div className="col-md-6">
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
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              style={{ backgroundColor: "#FF6F61", border: "none" }}
            >
              Sign Up
            </button>
            <div className="text-center mt-3">
              <div className="divider-line">
                <span className="divider-text">or</span>
              </div>
              <p>Already have an account? <Link to="/login" style={{ color: "#FF6F61" }}>Log in</Link></p>
            </div>
          </form>
        </div>
      </div>
      {showVerifyEmail && localFormData.email && (
        <VerifyEmail />
      )}
      <ToastContainer />
    </div>
  );
};

export default Signup;



