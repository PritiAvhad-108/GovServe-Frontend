import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CitizenStyles/pages/NotificationPage.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [summary, setSummary] = useState({ total: 0, unread: 0, read: 0 });
  const [activeTab, setActiveTab] = useState("all");

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  const API_BASE = "https://localhost:7027/api/Notification";

  const loadData = async () => {
    if (!userId || userId === "undefined" || !token) {
      console.warn("NotificationPage: Missing userId or Token");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(`${API_BASE}/${userId}`, config);
      const data = Array.isArray(res.data) ? res.data : [];
      
      const unreadRes = await axios.get(`${API_BASE}/unread/${userId}`, config);
      const unreadCount = typeof unreadRes.data === "number" ? unreadRes.data : 0;

      setNotifications(data);
      setSummary({
        total: data.length,
        unread: unreadCount,
        read: data.length - unreadCount,
      });
    } catch (err) {
      console.error("Error loading notification data:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, [userId, token]);

  const handleMarkRead = async (id) => {
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      await axios.put(`${API_BASE}/mark-read/${id}`, {}, config);
      loadData(); 
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const unreadIds = notifications.filter((n) => !n.isRead).map((n) => n.id);
      if (unreadIds.length === 0) return;
      
    
      await Promise.all(unreadIds.map((id) => axios.put(`${API_BASE}/mark-read/${id}`, {}, config)));
      loadData();
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  return (
    <div className="content-wrapper">
      <h2 className="page-title">Notifications</h2>
      <p className="subtitle">Stay updated with your application status</p>

      <div className="notification-actions">
        <div className="tabs">
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All ({summary.total})</button>
          <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>Unread ({summary.unread})</button>
          <button className={activeTab === "read" ? "active" : ""} onClick={() => setActiveTab("read")}>Read ({summary.read})</button>
        </div>
        <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark All as Read</button>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-data">No notifications available</div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item-card ${n.isRead ? "read" : "unread"}`}
              onClick={() => handleMarkRead(n.id)}
            >
              <div className="notif-header">
                <span className="notif-title">
                  {n.title} {!n.isRead && <span className="new-dot"></span>}
                </span>
                <span className="notif-date">{new Date(n.submittedDate).toLocaleDateString()}</span>
              </div>
              <p className="notif-message">{n.message || "No details available"}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPage;