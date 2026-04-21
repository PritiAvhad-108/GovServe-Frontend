import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiX } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import "./GrievanceProfilePopup.css";

const GrievanceProfilePopup = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout(); 
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/*  PROFILE POPUP */}
      <div
        className="profile-popup"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        {/* Avatar */}
        <div className="avatar">
          {user?.fullName
            ? user.fullName.charAt(0).toUpperCase()
            : "G"}
        </div>

        <h4>Hi, Grievance Officer</h4>

        <div className="popup-actions">
          <button
            className="action-btn"
            onClick={() => {
              onClose();
              navigate("/grievance-officer/profile");
            }}
          >
            <FiUser size={16} />
            <span>My profile</span>
          </button>

          <button
            className="action-btn logout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <FiLogOut size={16} />
            <span>Log out</span>
          </button>
        </div>

        <div className="popup-footer">
          <span>Privacy policy</span>
          <span> · </span>
          <span>Terms of service</span>
        </div>
      </div>

      {/*  LOGOUT CONFIRM MODAL*/}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Yes, Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default GrievanceProfilePopup;