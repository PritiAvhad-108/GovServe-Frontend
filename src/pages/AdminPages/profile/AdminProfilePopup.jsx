import React from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiLogOut, FiX } from "react-icons/fi";
import "./AdminProfilePopup.css";

export default function AdminProfilePopup({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="profile-popup">
      {/* Close */}
      <button className="close-btn">
        <FiX />
      </button>

      {/* Avatar */}
      <div className="avatar">
        {user?.fullName?.charAt(0)?.toUpperCase() || "A"}
      </div>

      {/* Greeting */}
      <h4>Hi, {user?.fullName || "Admin User"}</h4>

      {/* Actions */}
      <div className="popup-actions">
        <button
          className="action-btn"
          onClick={() => navigate("/admin/profile")}
        >
          <FiUser size={16} color="#111827" />
          <span style={{ color: "#111827" }}>My profile</span>
        </button>

        <button
          className="action-btn"
          onClick={handleLogout}
        >
          <FiLogOut size={16} />
          <span  style={{ color: "#111827" }}>Sign out</span>
        </button>
      </div>

      {/* Footer */}
      <div className="popup-footer">
        <span  style={{ color: "#111827" }}>Privacy policy</span>
        <span>·</span>
        <span  style={{ color: "#111827" }}>Terms of service</span>
      </div>
    </div>
  );
}