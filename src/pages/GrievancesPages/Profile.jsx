import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaBuilding } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import "../styles/Profile.css";

const Profile = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ userId from auth (fallback added for safety)
        const userId = authUser?.userId;

        if (!userId) {
          console.error("User ID not found in auth context");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `https://localhost:7027/api/User/${userId}`
        );

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authUser]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "60px" }}>
        Profile data not found
      </div>
    );
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        {/* ✅ Header */}
        <div className="header-banner">
          <div className="profile-avatar">
            <FaUser size={48} color="#2563eb" />
          </div>
        </div>

        {/* ✅ Content */}
        <div className="profile-content">
          <div className="user-title">
            <h2>{user.fullName}</h2>
            <p>{user.roleName} Profile</p>
          </div>

          {/* ✅ Info Items */}

          <div className="info-item">
            <div className="icon-box"><FaUser /></div>
            <div className="info-detail">
              <label>Full Name</label>
              <span>{user.fullName}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaEnvelope /></div>
            <div className="info-detail">
              <label>Email</label>
              <span>{user.email}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaPhone /></div>
            <div className="info-detail">
              <label>Phone</label>
              <span>{user.phone || "Not Provided"}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaUserTag /></div>
            <div className="info-detail">
              <label>Role</label>
              <span>{user.roleName}</span>
            </div>
          </div>

          <div className="info-item">
            <div className="icon-box"><FaBuilding /></div>
            <div className="info-detail">
              <label>Status</label>
              <span>{user.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;