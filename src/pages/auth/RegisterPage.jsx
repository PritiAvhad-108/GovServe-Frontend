import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 
import Swal from "sweetalert2"; 
import { User, Mail, Phone, Lock, Shield, Briefcase, UserPlus } from "lucide-react";
import "../../styles/LandingStyle/AuthStyle.css";
import Navbar from "../../components/Landing/layout/Navbar";
import Footer from "../../components/Landing/layout/Footer";

function RegisterPage() {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "",
    roleID: null, roleName: "", departmentID: null, departmentName: ""
  });

  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get("https://localhost:7027/api/Roles").then(res => setRoles(res.data)).catch(console.error);
    axios.get("https://localhost:7027/api/Department/active").then(res => setDepartments(res.data)).catch(console.error);
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = "Full Name is required";
    if (!formData.email) {
      tempErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (formData.phone.length < 10) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.roleID) tempErrors.roleID = "Please select a role";
    if (formData.roleName === "Officer" && !formData.departmentID) {
      tempErrors.departmentID = "Department is required for Officers";
    }
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await axios.post("https://localhost:7027/api/User/register", formData);
      

      const message = response.data; 

      if (message === "Registration Successful") {
        Swal.fire({
          title: "Success!",
          text: "Registration Successful! You can now login.",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
          timer: 3000
        });
        navigate("/login");
      } 
      else if (message === "Your registration request is sent to admin") {
        Swal.fire({
          title: "Request Sent!",
          text: "Your registration is pending admin approval.",
          icon: "info", 
          confirmButtonColor: "#1e3a8a"
        });
        navigate("/login");
      } 
      else {
        Swal.fire({
          title: "Wait!",
          text: message, 
          icon: "warning",
          confirmButtonColor: "#f39c12"
        });
      }

    } catch (err) {
      console.error("Error:", err);
      Swal.fire({
        title: "Error!",
        text: "Server error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ marginBottom: '10px', color: '#1e3a8a' }}>
              <UserPlus size={48} strokeWidth={1.5} />
            </div>
            <h2>Create Account</h2>
            <p>Sign up to GovServe Portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            
            {/* Full Name */}
            <div className="form-group mb-2">
              <label className="d-flex align-items-center gap-2 mb-1">
                <User size={16} /> Full Name <span className="text-danger">*</span>
              </label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Enter your full name" 
                onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
              />
              {errors.fullName && <small className="error-text">{errors.fullName}</small>}
            </div>

            {/* Email Address */}
            <div className="form-group mb-2">
              <label className="d-flex align-items-center gap-2 mb-1">
                <Mail size={16} /> Email Address <span className="text-danger">*</span>
              </label>
              <input 
                type="email" 
                className="form-control"
                placeholder="Enter email address" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
              {errors.email && <small className="error-text">{errors.email}</small>}
            </div>

            {/* Phone Number */}
            <div className="form-group mb-2">
              <label className="d-flex align-items-center gap-2 mb-1">
                <Phone size={16} /> Phone Number <span className="text-danger">*</span>
              </label>
              <input 
                type="tel" 
                className="form-control"
                placeholder="Enter phone number"
                onChange={(e) => setFormData({...formData, phone: e.target.value})} 
              />
              {errors.phone && <small className="error-text">{errors.phone}</small>}
            </div>

            {/* Password */}
            <div className="form-group mb-2">
              <label className="d-flex align-items-center gap-2 mb-1">
                <Lock size={16} /> Password <span className="text-danger">*</span>
              </label>
              <input 
                type="password" 
                className="form-control"
                placeholder="Create a password"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
              {errors.password && <small className="error-text">{errors.password}</small>}
            </div>

            {/* Role Selection */}
            <div className="form-group mb-2">
              <label className="d-flex align-items-center gap-2 mb-1">
                <Shield size={16} /> Select Role <span className="text-danger">*</span>
              </label>
              <select className="form-select" onChange={(e) => {
                const role = roles.find(r => r.roleID === parseInt(e.target.value));
                setFormData({...formData, roleID: role?.roleID, roleName: role?.roleName});
              }}>
                <option value="">-- Choose Role --</option>
                {roles.map(r => <option key={r.roleID} value={r.roleID}>{r.roleName}</option>)}
              </select>
              {errors.roleID && <small className="error-text">{errors.roleID}</small>}
            </div>

            {/* Department Selection */}
            <div className="form-group mb-4">
              <label className="d-flex align-items-center gap-2 mb-1">
                <Briefcase size={16} /> Department {formData.roleName === "Officer" && <span className="text-danger">*</span>}
              </label>
              <select 
                className="form-select" 
                disabled={formData.roleName !== "Officer"}
                onChange={(e) => {
                  const d = departments.find(dept => dept.departmentID === parseInt(e.target.value));
                  setFormData({...formData, departmentID: d?.departmentID, departmentName: d?.departmentName});
                }}
              >
                <option value="">-- Choose Department --</option>
                {departments.map(d => <option key={d.departmentID} value={d.departmentID}>{d.departmentName}</option>)}
              </select>
              {errors.departmentID && <small className="error-text">{errors.departmentID}</small>}
            </div>

            <button type="submit" className="auth-btn">
              Sign Up
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegisterPage;