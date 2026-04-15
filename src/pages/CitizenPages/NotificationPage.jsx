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
    if (!userId || userId === "undefined" || !token) return;

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_BASE}/all/${userId}`, config);
      const data = Array.isArray(res.data) ? res.data : [];
      
      const unreadRes = await axios.get(`${API_BASE}/unread/${userId}`, config);
      const unreadCount = Array.isArray(unreadRes.data) ? unreadRes.data.length : unreadRes.data;

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
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`${API_BASE}/mark-read/${id}`, {}, config);
      loadData(); 
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "unread") return !n.isRead;
    if (activeTab === "read") return n.isRead;
    return true;
  });

  return (
    <div className="content-wrapper">
      {/* Header Section for Centering Title */}
      <div className="notification-header-section">
        <h2 className="page-title">Notifications</h2>
        <p className="subtitle">Stay updated with your application status</p>
      </div>

      <div className="notification-actions">
        <div className="tabs">
          <button className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All ({summary.total})</button>
          <button className={activeTab === "unread" ? "active" : ""} onClick={() => setActiveTab("unread")}>Unread ({summary.unread})</button>
          <button className={activeTab === "read" ? "active" : ""} onClick={() => setActiveTab("read")}>Read ({summary.read})</button>
        </div>
      </div>

      <div className="notification-list">
        {filteredNotifications.length === 0 ? (
          <div className="no-data">No notifications available</div>
        ) : (
          filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`notification-item-card ${n.isRead ? "read" : "unread"}`}
              onClick={() => !n.isRead && handleMarkRead(n.id)}
            >
              <div className="notif-header">
                <span className="notif-title">
                  {n.title || n.category} {!n.isRead && <span className="new-dot"></span>}
                </span>
                <span className="notif-date">
                    {n.createdDate ? new Date(n.createdDate).toLocaleDateString() : "Date N/A"}
                </span>
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