import { useState, useRef, useEffect } from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/landing/logo.png";

export default function SupervisorNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [open, setOpen] = useState(false);
  const [showProfileCard, setShowProfileCard] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    toast.success("Logout successful");
    navigate("/");
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setShowProfileCard(false); // ✅ close profile card too
      }
    };
    document.addEventListener("mousedown", closeDropdown);
    return () => document.removeEventListener("mousedown", closeDropdown);
  }, []);

  return (
    <header className="sup-topbar">
      {/* LEFT */}
      <div className="sup-topbar-left">
        <FiMenu className="sup-menu" onClick={onToggleSidebar} />

        <div
          className="sup-brand"
          onClick={() => navigate("/supervisor/dashboard")}
        >
          <img src={logo} alt="GovServe" />
          <div>
            <span className="sup-title">GovServe</span>
            <span className="sup-sub">Government Services</span>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="sup-topbar-right">
        <FaChartBar onClick={() => navigate("/supervisor/reports")} />
        <FiBell onClick={() => navigate("/supervisor/notifications")} />

        {/* USER DROPDOWN */}
        <div
          className="sup-user"
          ref={dropdownRef}
          onClick={() => setOpen(!open)}
        >
          <FiUser />
          <span>{user?.fullName || "Supervisor"}</span>

          {open && (
            <div className="sup-dropdown">
              <div
                onClick={(e) => {
                  e.stopPropagation(); // ✅ prevent closing dropdown
                  setShowProfileCard(!showProfileCard);
                }}
              >
                My Profile
              </div>

              <div className="logout" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </div>

              {showProfileCard && (
                <div className="sup-profile-card">
                  <div className="profile-row">
                    <span className="label">Name</span>
                    <span className="value">
                      {user?.fullName || "-"}
                    </span>
                  </div>

                  <div className="profile-row">
                    <span className="label">Email</span>
                    <span className="value">
                      {user?.email || "—"}
                    </span>
                  </div>

                  <div className="profile-row">
                    <span className="label">Role</span>
                    <span className="value">
                      {user?.role || "Supervisor"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}