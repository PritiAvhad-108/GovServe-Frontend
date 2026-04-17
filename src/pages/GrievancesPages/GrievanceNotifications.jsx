import { useEffect, useState } from "react";
import { getUserNotifications } from "../../api/GrievanceApi";
import { useAuth } from "../../context/AuthContext";
import "../../styles/GrievanceStyles/GrievanceNotification.css"; 

const GrievanceNotifications = () => {
  const { user } = useAuth(); 
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const res = await getUserNotifications(user.userId);
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Grievance Notifications</h2>

      {loading && <p>Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p>No notifications available</p>
      )}

      {!loading &&
        notifications.map((n) => (
          <div key={n.notificationId} className="notification-card">
            <p>{n.message}</p>
            <small>
              Case ID: {n.caseId} <br />
              Category: {n.category} <br />
              {new Date(n.createdDate).toLocaleString()}
            </small>
          </div>
        ))}
    </div>
  );
};

export default GrievanceNotifications;