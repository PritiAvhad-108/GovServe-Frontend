import React, { useEffect, useState } from "react";
import "./Notifications.css";
import {
  sendNotification,
  getNotificationsByUser,
  markNotificationRead,
  getAllUsers
} from "../../../api/api";

const Notifications = () => {
  const supervisorId = Number(localStorage.getItem("userId"));

  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    userId: "",
    message: "",
    category: "General"
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsByUser(supervisorId);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    try {
      await sendNotification({
        userId: Number(form.userId),
        message: form.message,
        category: form.category
      });

      setSuccessMsg("✅ Notification sent successfully");

      setForm({
        userId: "",
        message: "",
        category: "General"
      });

      fetchNotifications();
    } catch (err) {
      console.error("Failed to send notification", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  return (
    <div className="notifications-container">
      <h2 className="page-title">Notifications</h2>

      {/* Send Notification */}
      <div className="notification-card send-box">
        <h3>Send Notification</h3>

        <form onSubmit={handleSendNotification}>
          <div className="form-row">
            <select
              value={form.userId}
              onChange={(e) =>
                setForm({ ...form, userId: e.target.value })
              }
              required
            >
              <option value="">Select Recipient</option>
              {users.map((u) => (
                <option key={u.userId} value={u.userId}>
                  {u.fullName} ({u.roleName})
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Notification message"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            required
          />

          <div className="form-row">
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
            >
              <option value="General">General</option>
              <option value="Assignment">Assignment</option>
              <option value="Escalation">Escalation</option>
              <option value="SLA">SLA</option>
              <option value="Update">Update</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>

        {successMsg && <p className="success-msg">{successMsg}</p>}
      </div>

      {/* My Notifications */}
      <div className="notification-card list-box">
        <h3>My Notifications</h3>

        {notifications.length === 0 ? (
          <p className="empty-text">No notifications available</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`notification-item ${
                n.status === "Unread" ? "unread" : ""
              }`}
            >
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <p className="notification-meta">
                  {n.category} • {new Date(n.createdDate).toLocaleString()}
                </p>
              </div>

              {n.status === "Unread" && (
                <button
                  className="read-btn"
                  onClick={() => handleMarkRead(n.notificationId)}
                >
                  Mark as Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;