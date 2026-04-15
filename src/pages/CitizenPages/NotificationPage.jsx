import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CitizenStyles/pages/NotificationPage.css";

// Assuming 'api' is your axios instance configuration
const api = axios.create({
  baseURL: "https://localhost:7027/api", 
});

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | UNREAD | READ
  const [loading, setLoading] = useState(true);

  // ✅ Get dynamic userId from localStorage
  const userId = localStorage.getItem("userId");

  /* ===============================
      Load notifications (backend-driven)
  =============================== */
  const loadNotifications = async () => {
    // Check if userId exists to avoid API errors
    if (!userId || userId === "undefined") {
      console.warn("No userId found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let res;

      // Using dynamic userId in URLs
      if (filter === "UNREAD") {
        res = await api.get(`/Notification/unread/${userId}`);
      } else if (filter === "READ") {
        res = await api.get(`/Notification/read/${userId}`);
      } else {
        res = await api.get(`/Notification/all/${userId}`);
      }

      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter, userId]); // Added userId as dependency

  /* ===============================
      Mark as read
  =============================== */
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/Notification/mark-read/${notificationId}`);
      loadNotifications();
      window.dispatchEvent(new Event("notifications-updated"));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  if (loading) {
    return <p className="notification-empty">Loading…</p>;
  }

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

      {/* FILTER TABS */}
      <div className="notification-filters">
        <button
          className={filter === "ALL" ? "active" : ""}
          onClick={() => setFilter("ALL")}
        >
          All
        </button>
        <button
          className={filter === "UNREAD" ? "active" : ""}
          onClick={() => setFilter("UNREAD")}
        >
          Unread
        </button>
        <button
          className={filter === "READ" ? "active" : ""}
          onClick={() => setFilter("READ")}
        >
          Read
        </button>
      </div>

      {/* LIST */}
      {notifications.length === 0 ? (
        <p className="notification-empty">
          No {filter.toLowerCase()} notifications
        </p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`notification-card ${
                !n.isRead ? "unread" : ""
              }`}
              onClick={() => {
                if (!n.isRead && filter !== "READ") {
                  markAsRead(n.notificationId);
                }
              }}
            >
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <span className="notification-date">
                  {new Date(n.createdDate).toLocaleString()}
                </span>
              </div>

              {/* ✅ STATUS BADGE */}
              <span
                className={`status-badge ${
                  n.isRead ? "read" : "unread"
                }`}
              >
                {n.isRead ? "Read" : "Unread"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}