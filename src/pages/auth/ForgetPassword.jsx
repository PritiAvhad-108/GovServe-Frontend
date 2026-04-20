import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, KeyRound } from "lucide-react"; 
import "../../styles/LandingStyle/AuthStyle.css";
import Navbar from "../../components/Landing/layout/Navbar";
import Footer from "../../components/Landing/layout/Footer";

function ForgetPassword() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [statusMessage, setStatusMessage] = useState("");
  const [errors, setErrors] = useState({});

  function validateForm() {
    const newErrors = {};
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Valid email is required.";
    }
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post("https://localhost:7027/api/Auth/ForgotPassword", formData);
      setStatusMessage(response.data); 
      setErrors({});
    } catch (error) {
      if (error.response) {
        setStatusMessage(error.response.data);
      } else {
        setStatusMessage("Network error. Please try again.");
      }
    }
  }

  return (
    <>
      <Navbar /> 
      
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
               <KeyRound size={40} color="#1e3a8a" />
            </div>
            <h2>Reset Password</h2>
            <p>Enter your email and a new password to recover access</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Email  */}
            <div className="form-group">
              <label><Mail size={16} /> Email Address *</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            {/* New Password  */}
            <div className="form-group">
              <label><Lock size={16} /> New Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Enter new password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-btn">Reset Password</button>

                        {statusMessage && (
              <div 
                className={`error-text ${statusMessage.includes("successfully") ? "text-success" : ""}`} 
                style={{ 
                  textAlign: 'center', 
                  marginTop: '15px', 
                  fontSize: '14px', 
                  color: statusMessage.includes("successfully") ? '#15803d' : '#dc3545',
                  padding: '10px',
                  background: statusMessage.includes("successfully") ? '#f0fdf4' : '#fef2f2',
                  borderRadius: '6px'
                }}
              >
                {statusMessage}
              </div>
            )}
          </form>

          <div className="auth-footer">
            Remembered your password? <Link to="/login">Back to Login</Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default ForgetPassword;