import { useState, useRef, useEffect } from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/landing/logo.png";
import SupervisorProfilePopup from "../../../pages/Supervisor/profile/SupervisorProfilePopup";

export default function SupervisorNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closePopup = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
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

        {/* USER */}
        <div
          className="sup-user"
          ref={dropdownRef}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <FiUser />
          <span>{user?.fullName || "Supervisor"}</span>

          {open && (
            <SupervisorProfilePopup
              user={{
                fullName: user?.fullName,
                email: user?.email,
                role: user?.role || "Supervisor",
              }}
              onClose={() => setOpen(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
}