import React, { useEffect, useState, useRef } from "react";
import "./layout.css";
import { FiBell, FiUser } from "react-icons/fi";
import { Home } from "lucide-react";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";
import AdminProfilePopup from "../../../pages/AdminPages/profile/AdminProfilePopup";
import { useAuth } from "../../../context/AuthContext";
import logo from "../../../assets/landing/logo.png";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const previousUnreadRef = useRef(0);
  const navigate = useNavigate();
  const { user } = useAuth();

  /* =========================
     GET ADMIN USER ID
  ========================= */
  const getAdminUserId = async () => {
    const res = await api.get("/User/all");
    const admin = res.data.find(u => u.roleName === "Admin");
    return admin?.userId;
  };

  /* =========================
     LOAD UNREAD COUNT
  ========================= */
  const loadUnreadCount = async () => {
    try {
      const adminUserId = await getAdminUserId();
      if (!adminUserId) return;

      const res = await api.get(`/Notification/unread/${adminUserId}`);
      const count = res.data.length;

      /*  SHAKE + TITLE CHANGE WHEN NEW NOTIFICATION ARRIVES */
      if (count > previousUnreadRef.current) {
        const oldTitle = document.title;
        document.title = "🔔 New Notification!";
        setTimeout(() => {
          document.title = oldTitle;
        }, 3000);

        const bell = document.querySelector(".notification-bell");
        bell?.classList.add("shake");
        setTimeout(() => bell?.classList.remove("shake"), 600);
      }

      previousUnreadRef.current = count;
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notification count", err);
    }
  };

  /* =========================
     EFFECTS
  ========================= */
  useEffect(() => {
    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const refresh = () => loadUnreadCount();
    window.addEventListener("notifications-updated", refresh);
    return () =>
      window.removeEventListener("notifications-updated", refresh);
  }, []);

  useEffect(() => {
    const closePopup = () => setOpen(false);
    window.addEventListener("click", closePopup);
    return () => window.removeEventListener("click", closePopup);
  }, []);

  /* =========================
     RENDER
  ========================= */
  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* ✅ LEFT BRAND */}
        <div className="navbar-brand">
          <img src={logo} alt="GovServe Logo" className="navbar-logo" />
          <div className="navbar-brand-text">
            <h3>GovServe</h3>
            <small>Government Services</small>
          </div>
        </div>

        {/*  RIGHT ACTIONS */}
        <div className="user-info-wrapper">

          {/*  HOME */}
          <div
            className="nav-home-btn"
            onClick={() => navigate("/")}
            title="Go to Home"
          >
            <Home size={18} />
            <span>Home</span>
          </div>

          {/*  NOTIFICATION — ENHANCED UI */}
          <div
            className={`notification-bell ${
              unreadCount > 0 ? "has-alert" : ""
            }`}
            onClick={() => navigate("/admin/notifications")}
            title="Notifications"
          >
            <FiBell size={20} />

            {unreadCount > 0 && (
              <span className="notification-count">
                {unreadCount}
              </span>
            )}
          </div>

          {/*  USER INFO */}
          <div
            className="user-info"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(prev => !prev);
            }}
          >
            <FiUser size={20} />

            <div className="user-text">
              <span className="user-name">
                {user?.role || "Admin"}
              </span>
              <small className="user-role">
                {user?.email || ""}
              </small>
            </div>

            {open && (
              <AdminProfilePopup
                user={{
                  fullName: user?.email?.split("@")[0],
                  roleName: user?.role
                }}
                onClose={() => setOpen(false)}
              />
            )}
          </div>

        </div>
      </div>
    </header>
  );
}