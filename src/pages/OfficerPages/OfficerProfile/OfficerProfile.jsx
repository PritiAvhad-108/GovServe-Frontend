import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaBuilding, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext";
import "./OfficerProfile.css";

const OfficerProfile = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            // ✅ Fallback to localStorage if authUser is slow to load
            const userId = authUser?.userId || localStorage.getItem('userId') || 2; 
            
            try {
                const response = await fetch(`https://localhost:7027/api/User/${userId}`);
                const data = await response.json();
                console.log("Fetched Officer Data:", data);
                setUser(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [authUser]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading Profile...</div>;

    return (
        <div className="profile-wrapper">
            <div className="profile-card">
                <div className="header-banner">
                    <div className="profile-avatar">
                        <FaUser size={45} color="#2563eb" />
                    </div>
                </div>

                <div className="profile-content">
                    <div className="user-title">
                        <h2>{user?.fullName || "Officer Name"}</h2>
                        <p>{user?.roleName || "Officer"} Profile</p>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaUser /></div>
                        <div className="info-detail">
                            <label>Full Name</label>
                            <span>{user?.fullName || "N/A"}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div className="info-detail">
                            <label>Email Address</label>
                            <span>{user?.email || "N/A"}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaPhone /></div>
                        <div className="info-detail">
                            <label>Phone Number</label>
                            <span>{user?.phone || user?.phoneNumber || "Not Provided"}</span>
                        </div>
                    </div>

                    {/* ✅ Used FaBuilding for Department, which makes sense for an Officer */}
                    <div className="info-item">
                        <div className="icon-box"><FaBuilding /></div>
                        <div className="info-detail">
                            <label>Department</label>
                            <span>{user?.department?.departmentName || user?.departmentName || "Revenue Department"}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaUserTag /></div>
                        <div className="info-detail">
                            <label>Role</label>
                            <span>{user?.roleName || "Officer"}</span>
                        </div>
                    </div>

                    {/* ✅ Used a Check Circle for the active status */}
                    {/* <div className="info-item">
                        <div className="icon-box"><FaCheckCircle /></div>
                        <div className="info-detail">
                            <label>Status</label>
                            <span className="status-badge">
                                {user?.status || "Active"}
                            </span>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default OfficerProfile;