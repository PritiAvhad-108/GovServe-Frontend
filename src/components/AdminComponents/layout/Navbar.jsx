import React, { useEffect, useState, useRef } from "react";
import "./layout.css";
import { FiBell, FiUser } from "react-icons/fi";
import api from "../../../api/api";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const previousUnreadRef = useRef(0);
  const navigate = useNavigate();

  const getAdminUserId = async () => {
    const res = await api.get("/User/all");
    const admin = res.data.find(u => u.roleName === "Admin");
    return admin?.userId;
  };

  const loadUnreadCount = async () => {
    try {
      const adminUserId = await getAdminUserId();
      if (!adminUserId) return;

      const res = await api.get(`/Notification/unread/${adminUserId}`);
      const count = res.data.length;

      // ✅ Only visual alert (NO AUDIO)
      if (count > previousUnreadRef.current) {
        const oldTitle = document.title;
        document.title = "🔔 New Notification!";
        setTimeout(() => {
          document.title = oldTitle;
        }, 3000);
      }

      previousUnreadRef.current = count;
      setUnreadCount(count);
    } catch (err) {
      console.error("Failed to load notification count", err);
    }
  };

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

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-actions">

          <div
            className={`notification-bell ${unreadCount > 0 ? "has-alert" : ""}`}
            onClick={() => navigate("/notifications")}
          >
            <FiBell size={22} />
            {unreadCount > 0 && (
              <span className="notification-count">{unreadCount}</span>
            )}
          </div>

          <div className="user-info">
            <FiUser size={20} />
            <span>Admin User</span>
          </div>

        </div>
      </div>
    </header>
  );
}