import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaTimes, FaGoogle } from "react-icons/fa";
import "../../Styles/LoginPage.css"; 
import { UserContext } from "../Context/UserContext";
import { loginUser, sendForgotPasswordEmail } from "./userAuthApi"; // Import API functions
import loginimage from "../../assets/login1.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false); 
  const navigate = useNavigate();
  const { fetchUserProfile } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setButtonDisabled(true); 

    try {
      const response = await sendForgotPasswordEmail(forgotEmail);
      if (response.status === 200) {
        toast.dismiss();
        toast.success("Password reset email sent", {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        });
        setForgotEmail("");
        setShowForgotPasswordForm(false); // Close the form
      }
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "Error sending reset email!", {
        position: "top-right",
        autoClose: 1000,
        transition: Slide,
      });
    } finally {
      setButtonDisabled(false); // Re-enable the button after request completes
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password.length < 8) {
      toast.dismiss();
      toast.error("Password must be at least 8 characters long!", {
        position: "top-right",
        autoClose: 1000,
        transition: Slide,
      });
      return;
    }

    try {
      const response = await loginUser(formData);
      console.log('Login response:', response.data); // Console log to check data

      if (response.status === 200) {
        const { user } = response.data;

        if (!user.verificationstatus) {
          console.log("status is : ",user.verificationstatus);
          toast.dismiss();
          toast.error("You are not verified. Please verify your email first.", {
            position: "top-right",
            autoClose: 5000,
            transition: Slide,
          });
          navigate("/verify", { state: { email: formData.email } }); // Pass email to verify page
          return;
        }

        toast.dismiss();
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 5000,
          transition: Slide,
        });

        await fetchUserProfile(); // Fetch user profile after successful login

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/dashboard");
        } else if(user.role === "user") {
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Error during login:", err); // Console log to check error
      toast.dismiss();
      toast.error(err.response?.data?.message || "Invalid credentials!", {
        position: "top-right",
        autoClose: 1000,
        transition: Slide,
      });
    }
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h2>Welcome Back</h2>
          <p>Log in to access your account and explore our services.</p>
          <img src={loginimage} alt="Login" className="login-image" />
        </div>
        <div className="login-right">
          {/* Forgot Password Form */}
          {showForgotPasswordForm && (
            <div className="forgot-password-form bg-light p-4 rounded shadow">
              <FaTimes
                className="close-icon"
                onClick={() => setShowForgotPasswordForm(false)}
                style={{ cursor: "pointer", fontSize: "1.5rem", position: "absolute", top: "10px", right: "15px" }}
              />
              <h3 className="text-center mb-4" style={{ color: "#FF6F61" }}>Forgot Password</h3>
              <form onSubmit={handleForgotPassword}>
                <div className="mb-3">
                  <label htmlFor="forgotEmail" className="form-label">Enter your email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="forgotEmail"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "#FF6F61", border: "none" }}
                  disabled={buttonDisabled} // Disable button when loading
                >
                  {buttonDisabled ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </div>
          )}

          {/* Login Form */}
          {!showForgotPasswordForm && (
            <div className="login-form bg-light p-4 rounded shadow">
              <h3 className="text-center mb-4" style={{ color: "#495057" }}>Log In</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "#495057", border: "none" }}
                >
                  Log In
                </button>
                <div className="text-center mt-3">
                  <p
                    className="text-link"
                    onClick={() => setShowForgotPasswordForm(true)}
                    style={{ cursor: "pointer", color: "#FF6F61" }}
                  >
                    Forgot Password?
                  </p>
                  <div className="divider-line">
                    <span className="divider-text">or</span>
                  </div>
                  <button
                    type="button"
                    className="login-with-google-btn"
                    onClick={handleGoogleLogin}
                  >
                    <FaGoogle className="me-2" /> Login with Google
                  </button>
                  <p className="mt-3">Don't have an account? <Link to="/signup" style={{ color: "#FF6F61" }}>Sign Up</Link></p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;