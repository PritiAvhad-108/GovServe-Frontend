import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./notifications.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL"); // ALL | UNREAD | READ
  const [loading, setLoading] = useState(true);

  const ADMIN_USER_ID = 2;

  /* ===============================
     Load notifications 
  =============================== */
  const loadNotifications = async () => {
    try {
      setLoading(true);
      let res;

      if (filter === "UNREAD") {
        res = await api.get(`/Notification/unread/${ADMIN_USER_ID}`);
      } else if (filter === "READ") {
        res = await api.get(`/Notification/read/${ADMIN_USER_ID}`);
      } else {
        res = await api.get(`/Notification/all/${ADMIN_USER_ID}`);
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
  }, [filter]);

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

              {/*  STATUS BADGE */}
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