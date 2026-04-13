import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 
import Swal from "sweetalert2"; 
import { Mail, Lock, LogIn } from "lucide-react"; 
import "../../styles/LandingStyle/AuthStyle.css";
import Navbar from "../../components/Landing/layout/Navbar";
import Footer from "../../components/Landing/layout/Footer";

function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

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
      const response = await axios.post("https://localhost:7027/api/Auth/login", formData);
      const { token, message } = response.data;
      
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userEmail", formData.email);
      
      const decodedToken = jwtDecode(token);

      const userId = 
        decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || 
        decodedToken["UserId"] || 
        decodedToken["nameid"] || 
        decodedToken["sub"];

      if (userId) {
        localStorage.setItem("userId", userId.toString()); 
      }

      const userRole = 
        decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
        decodedToken.role;

    
      Swal.fire({
        title: "Login Successful!",
        text: "Redirecting to your dashboard...",
        icon: "success",
        confirmButtonColor: "#1e3a8a",
        timer: 2000,
        showConfirmButton: false
      });

      if (userRole === "Citizen") navigate("/citizen");
      else if (userRole === "Admin") navigate("/admin");
      else if (userRole === "Officer") navigate("/officer");
      else if (userRole === "Supervisor") navigate ("/supervisor");
 
      else navigate("/"); 

    } catch (error) {
      
      const errorMsg = error.response?.data || "Invalid email or password.";
      Swal.fire({
        title: "Login Failed",
        text: errorMsg,
        icon: "error",
        confirmButtonColor: "#dc3545"
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
               <LogIn size={40} color="#1e3a8a" />
            </div>
            <h2>Welcome Back</h2>
            <p>Login to access your GovServe account</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label><Mail size={16} /> Email Address *</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password *</label>
              <input
                type="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
              
              <div className="forget-password-link">
                <Link to="/forget-password">Forget Password?</Link>
              </div>
            </div>

            <button type="submit" className="auth-btn">Login</button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register Now</Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;