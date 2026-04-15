import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./notifications.css";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  /* ===============================
     Get admin userId from localStorage
  =============================== */
  const ADMIN_USER_ID = Number(localStorage.getItem("userId"));

  /* ===============================
     Load notifications
  =============================== */
  const loadNotifications = async () => {
    if (!ADMIN_USER_ID) {
      console.error("Admin userId not found");
      setLoading(false);
      return;
    }

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
  }, [filter, ADMIN_USER_ID]);

  if (loading) {
    return <p className="notification-empty">Loading…</p>;
  }

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>

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

      {notifications.length === 0 ? (
        <p className="notification-empty">
          No {filter.toLowerCase()} notifications
        </p>
      ) : (
        <div className="notification-list">
          {notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`notification-card ${!n.isRead ? "unread" : ""}`}
              onClick={() => {
                if (!n.isRead && filter !== "READ") {
                  api.put(`/Notification/mark-read/${n.notificationId}`)
                    .then(loadNotifications);
                }
              }}
            >
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <span className="notification-date">
                  {new Date(n.createdDate).toLocaleString()}
                </span>
              </div>

              <span className={`status-badge ${n.isRead ? "read" : "unread"}`}>
                {n.isRead ? "Read" : "Unread"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
