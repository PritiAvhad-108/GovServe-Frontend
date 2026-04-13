import React, { useState } from "react";
import { FaUserCircle, FaCaretDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../../../styles/GrievanceStyles/navbar.css";
import logo from "../../../assets/landing/logo.png";



const GrievanceNavbar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate();
    const { user, logout } = useAuth();
  return (
    <nav className="navbar">
      <div className="navbar-left">
        
<div className="logo-wrapper">
  <img src={logo} alt="GovServe Logo" className="navbar-logo" />
</div>


        <div className="brand-text">
          <h3>GovServe</h3>
          <span>Government Services</span>
        </div>
      </div>

      <div className="navbar-right">
  <div
    className="profile-trigger"
    onClick={() => setShowMenu(!showMenu)}
  >
    <FaUserCircle size={24} />
    <span>{user?.fullName || "Officer"}</span>
    <FaCaretDown size={12} />
  </div>

  {showMenu && (
    <div className="profile-dropdown">
      <div
        className="dropdown-item"
        onClick={() => {
          setShowMenu(false);
          navigate("/grievances/profile");
        }}
      >
        My Profile
      </div>

      <div
        className="dropdown-item logout"
        onClick={() => {
          setShowMenu(false);
          logout();
          navigate("/login");
        }}
      >
        Logout
      </div>
    </div>
  )}
</div>

    </nav>


  );
};

export default GrievanceNavbar;