import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiX } from "react-icons/fi";
import "./AdminProfilePopup.css";

export default function AdminProfilePopup({ user, onClose }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true }); // ✅ IMPORTANT
  };

  return (
    <>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiX />
        </button>

        <div className="avatar">
          {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
        </div>

        <h4>Hi, {user?.fullName || "Admin"}</h4>

        <div className="popup-actions">
          <button
            className="action-btn"
            onClick={() => {
              onClose();
              navigate("/admin/profile");
            }}
          >
            <FiUser size={16} />
            <span>My profile</span>
          </button>

          <button
            className="action-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <FiLogOut size={16} />
            <span>Log out</span>
          </button>
        </div>

        <div className="popup-footer">
          <span>Privacy policy</span>
          <span>·</span>
          <span>Terms of service</span>
        </div>
      </div>

      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h4>Confirm Log Out</h4>
            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button className="confirm-btn" onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}