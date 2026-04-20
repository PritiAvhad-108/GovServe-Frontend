import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaBuilding } from 'react-icons/fa';
import { useAuth } from "../../../context/AuthContext"; 
import "./AdminProfile.css";

const Profile = () => {
    const { user: authUser } = useAuth(); 
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = authUser?.userId || 1; 
            try {
                const response = await fetch(`https://localhost:7027/api/User/${userId}`);
                const data = await response.json();
                console.log("Fetched Data:", data);
                setUser(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [authUser]);

    if (loading) return <div style={{textAlign: 'center', padding: '50px'}}>Loading...</div>;

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
                
                        <h2>{user?.fullName}</h2>
                        <p>{user?.roleName} Profile</p>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaUser /></div>
                        <div className="info-detail">
                            <label>Full Name</label>
                            <span>{user?.fullName}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaEnvelope /></div>
                        <div className="info-detail">
                            <label>Email Address</label>
                            <span>{user?.email}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaPhone /></div>
                        <div className="info-detail">
                            <label>Phone Number</label>
                            <span>{user?.phone || "Not Provided"}</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div className="icon-box"><FaUserTag /></div>
                        <div className="info-detail">
                            <label>Role</label>
                            <span>{user?.roleName}</span>
                        </div>
                    </div>

                   
                </div>
            </div>
        </div>
    );
};

export default Profile;