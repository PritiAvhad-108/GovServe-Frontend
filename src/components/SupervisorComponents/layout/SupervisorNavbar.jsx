import { useState, useRef, useEffect } from "react";
import { FiBell, FiUser, FiMenu } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getNotificationsByUser } from "../../../api/api"; 
import logo from "../../../assets/landing/logo.png";
import SupervisorProfilePopup from "../../../pages/Supervisor/profile/SupervisorProfilePopup";

export default function SupervisorNavbar({ onToggleSidebar }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ADDED: unread notification count
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const closePopup = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  // ADDED: fetch unread notifications
  useEffect(() => {
    if (!user?.userId) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await getNotificationsByUser(user.userId);
        const unread = (res.data || []).filter(n => !n.isRead);
        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Failed to fetch notification count", err);
      }
    };

    fetchUnreadCount();

    // optional auto-refresh
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

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

        {/* UPDATED BELL WITH BADGE */}
        <div
          className="notification-bell"
          onClick={() => navigate("/supervisor/notifications")}
        >
          <FiBell />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </div>

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
