import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import "./SupervisorProfilePopup.css";

export default function SupervisorProfilePopup({ user, onClose }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // NEW STATE (added, not removing anything)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // EXISTING LOGOUT LOGIC (kept simple)
  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  return (
    <>
      {/* ===== PROFILE POPUP ===== */}
      <div
        className="sup-profile-popup"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className="popup-close" onClick={onClose}>
          ×
        </button>

        {/* Avatar */}
        <div className="popup-avatar">
          {user?.fullName?.[0]?.toUpperCase() || "S"}
        </div>

        <h3>Hi, {user?.fullName || "Supervisor"}</h3>

        {/* Buttons */}
        <div className="popup-actions">
          <button
            className="popup-btn"
            onClick={() => navigate("/supervisor/profile")}
          >
            <User size={16} /> My profile
          </button>

          {/*  UPDATED: opens confirmation (logic NOT removed) */}
          <button
            className="popup-btn logout"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <LogOut size={16} /> Log out
          </button>
        </div>

        <div className="popup-footer">
          Privacy policy · Terms of service
        </div>
      </div>

      {/* ===== LOGOUT CONFIRMATION MODAL ===== */}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div
            className="logout-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="btn-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="btn-logout"
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