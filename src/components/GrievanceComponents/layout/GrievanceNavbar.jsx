
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "../../../styles/GrievanceStyles/navbar.css";
import logo from "../../../assets/landing/logo.png";

const GrievanceNavbar = () => {
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const firstName = user?.fullName?.split(" ")[0] || "Manasi";

  return (
    <>
      {/* Navbar */}
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
            onClick={() => setShowProfilePopup((prev) => !prev)}
          >
            <FaUserCircle size={24} />
            <span>{user?.fullName || "Grievance Officer"}</span>
          </div>
        </div>
      </nav>

      {/*  Profile Popup */}
      {showProfilePopup && (
        <div className="profile-popup">
          <span
            className="profile-close"
            onClick={() => setShowProfilePopup(false)}
          >
            ×
          </span>

          <div className="profile-avatar">
            {firstName.charAt(0)}
          </div>

          <p className="profile-greeting">
            Hi, {firstName}
          </p>

          <div className="profile-actions">
            <button
              className="profile-btn"
              onClick={() => {
                setShowProfilePopup(false);
                navigate("/grievances/profile");
              }}
            >
              My profile
            </button>

            <button
              className="profile-btn logout-btn"
              onClick={() => {
                setShowProfilePopup(false);
                setShowLogoutPopup(true);
              }}
            >
              Log out
            </button>
          </div>

          <div className="profile-footer">
            Privacy policy · Terms of service
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutPopup && (
        <div className="logout-modal-backdrop">
          <div className="logout-modal">
            <p className="logout-text">
              Are you sure you want to log out?
            </p>

            <div className="logout-modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutPopup(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-logout-btn"
                onClick={() => {
                  setShowLogoutPopup(false);
                  logout();
                  navigate("/login");
                }}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GrievanceNavbar;