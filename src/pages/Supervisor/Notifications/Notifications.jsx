import React, { useEffect, useState } from "react";
import "./Notifications.css";
import api from "../../../api/api";
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
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [form, setForm] = useState({
    message: "",
    category: "General"
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  /* =========================
     LOAD DATA
  ========================= */

  useEffect(() => {
    if (supervisorId && !isNaN(supervisorId)) {
      fetchNotifications();
    }
    fetchUsers();
    fetchRoles();
  }, [supervisorId]);

  const fetchNotifications = async () => {
    try {
      const res = await getNotificationsByUser(supervisorId);
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get("/Roles");
      setRoles(res.data); // [{ roleID, roleName }]
    } catch (err) {
      console.error("Failed to fetch roles", err);
    }
  };

  /* =========================
     SEND NOTIFICATION
  ========================= */

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!selectedRole || !form.message.trim()) {
      setErrorMsg("⚠️ Please select a role and enter a message");
      return;
    }

    setLoading(true);

    try {
      const roleUsers = users.filter(
        u => u.roleName?.toLowerCase() === selectedRole.toLowerCase()
      );

      if (roleUsers.length === 0) {
        setErrorMsg("⚠️ No users found for selected role");
        return;
      }

      for (const user of roleUsers) {
        await sendNotification({
          userId: user.userId,
          message: form.message,
          category: form.category
        });
      }

      setSuccessMsg(`✅ Notification sent successfully to ${selectedRole}`);
      setForm({ message: "", category: "General" });
      setSelectedRole("");

      fetchNotifications();

    } catch (err) {
      console.error("Send notification error", err);
      setErrorMsg("❌ Failed to send notification");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     MARK AS READ
  ========================= */

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    fetchNotifications();
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="notifications-container">
      <h2 className="page-title">Notifications</h2>

      {/* SEND CARD */}
      <div className="notification-card send-box centered-card">
        <h3>Send Notification</h3>

        <div className="send-form-wrapper wide">
          <form onSubmit={handleSendNotification}>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>
              {roles.map((r) => (
                <option key={r.roleID} value={r.roleName}>
                  {r.roleName}
                </option>
              ))}
            </select>

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
                <option>General</option>
                <option>Assignment</option>
                <option>Escalation</option>
                <option>SLA</option>
                <option>Update</option>
              </select>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          {successMsg && <div className="success-banner">{successMsg}</div>}
          {errorMsg && <div className="error-banner">{errorMsg}</div>}
        </div>
      </div>

      {/* MY NOTIFICATIONS */}
      <div className="notification-card list-box">
        <h3>My Notifications</h3>

        {notifications.length === 0 ? (
          <p className="empty-text">No notifications available</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n.notificationId}
              className={`notification-item ${!n.isRead ? "unread" : ""}`}
            >
              <div className="notification-content">
                <p className="notification-message">{n.message}</p>
                <p className="notification-meta">
                  {n.category} • {new Date(n.createdDate).toLocaleString()}
                </p>
              </div>

              {!n.isRead && (
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