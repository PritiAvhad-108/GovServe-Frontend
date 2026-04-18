import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/CitizenStyles/pages/NotificationPage.css";


const api = axios.create({
  baseURL: "https://localhost:7027/api", 
});

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL"); 
  const [loading, setLoading] = useState(true);

 
  const userId = localStorage.getItem("userId");

  
  const loadNotifications = async () => {
    
    if (!userId || userId === "undefined") {
      console.warn("No userId found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let res;

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
  }, [filter, userId]); 

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