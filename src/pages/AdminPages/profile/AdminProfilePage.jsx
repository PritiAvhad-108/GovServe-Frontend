import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProfile.css";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`/api/User/${userId}`)
      .then(res => setProfile(res.data));
  }, []);

  if (!profile) return <p>Loading...</p>;

  if (profile.roleName !== "Admin") {
    return <h3>Access Denied</h3>;
  }

  return (
    <div className="admin-profile">
      <h2>Admin Profile</h2>

      <div className="profile-card">
        <div><strong>Name:</strong> {profile.fullName}</div>
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Phone:</strong> {profile.phone}</div>
        <div><strong>Role:</strong> {profile.roleName}</div>
        <div><strong>Status:</strong> {profile.status}</div>
      </div>
    </div>
  );
};

export default AdminProfile;