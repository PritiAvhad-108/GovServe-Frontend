import React, { useEffect, useState } from 'react';
import { OfficerDashboardCount } from '../../../api/OfficerDashboard';
import StatCard from '../../AdminPages/dashboard/StatCard'; 
import './OfficerDashboard.css';

const OfficerDashboard = () => {
    const [counts, setCounts] = useState({
        assigned: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        resubmitted: 0
    });
    const [loading, setLoading] = useState(true);

    // Get ID from localStorage, defaulting to 1 if not found
    const officerId = localStorage.getItem('userId') || 2; 

    useEffect(() => {
        const loadDashboardData =  async () => {
            if (!officerId) return;

            try {
                setLoading(true);
                
                // Fetch the response from your API utility
                const response = await OfficerDashboardCount(officerId);
                
                // Logging for verification: Look for the 'data' property in the console
                console.log("Axios Response:", response);

                // Destructure the actual body sent by the backend (response.data)
                const apiData = response.data;

                if (apiData) {
                    setCounts({
                        assigned: apiData.assignedCount || 0,
                        pending: apiData.pendingVerificationCount || 0,
                        approved: apiData.approvedCount || 0,
                        rejected: apiData.rejectedCount || 0,
                        resubmitted: apiData.resubmittedCount || 0
                    });
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, [officerId]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading Dashboard Statistics...</p>
            </div>
        );
    }

    return (
        <div className="officer-dashboard">
            <header className="dashboard-header">
                <h1>Officer Dashboard</h1>
                <p>Overview of your case assignments (ID: {officerId})</p>
            </header>

            <div className="stats-grid">
                <StatCard 
                    title="Assigned" 
                    value={counts.assigned} 
                    icon="📋" 
                    color="#3498db" 
                />
                <StatCard 
                    title="Pending" 
                    value={counts.pending} 
                    icon="⏳" 
                    color="#f1c40f" 
                />
                <StatCard 
                    title="Approved" 
                    value={counts.approved} 
                    icon="✅" 
                    color="#2ecc71" 
                />
                <StatCard 
                    title="Resubmitted" 
                    value={counts.resubmitted} 
                    icon="🔄" 
                    color="#9b59b6" 
                />
                <StatCard 
                    title="Rejected" 
                    value={counts.rejected} 
                    icon="❌" 
                    color="#e74c3c" 
                />
            </div>
        </div>
    );
};

export default OfficerDashboard;