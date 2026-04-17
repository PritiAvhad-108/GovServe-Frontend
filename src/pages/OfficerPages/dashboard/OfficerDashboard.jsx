import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { OfficerDashboardCount } from '../../../api/OfficerDashboard';
import StatCard from '../../AdminPages/dashboard/StatCard'; 
import './OfficerDashboard.css';

const OfficerDashboard = () => {
    const navigate = useNavigate(); 

    const [counts, setCounts] = useState({
        assigned: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        resubmitted: 0
    });
    const [loading, setLoading] = useState(true);

    const officerId = localStorage.getItem('userId') || 2; 

    useEffect(() => {
        const loadDashboardData =  async () => {
            if (!officerId) return;

            try {
                setLoading(true);
                const response = await OfficerDashboardCount(officerId);
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
                
                {/* ✅ FIXED: Updated path to '/officer/assigned-cases' */}
                <div onClick={() => navigate('/officer/assigned-cases')} style={{ cursor: 'pointer' }}>
                    <StatCard 
                        title="Assigned" 
                        value={counts.assigned} 
                        icon="📋" 
                        color="#3498db" 
                    />
                </div>

                {/* ✅ FIXED: Updated path to '/officer/pending-review' */}
                <div onClick={() => navigate('/officer/pending-review')} style={{ cursor: 'pointer' }}>
                    <StatCard 
                        title="Pending" 
                        value={counts.pending} 
                        icon="⏳" 
                        color="#f1c40f" 
                    />
                </div>

                <div onClick={() => navigate('/officer/approved')} style={{ cursor: 'pointer' }}>
                    <StatCard 
                        title="Approved" 
                        value={counts.approved} 
                        icon="✅" 
                        color="#2ecc71" 
                    />
                </div>

                <div onClick={() => navigate('/officer/resubmitted')} style={{ cursor: 'pointer' }}>
                    <StatCard 
                        title="Resubmitted" 
                        value={counts.resubmitted} 
                        icon="🔄" 
                        color="#9b59b6" 
                    />
                </div>

                <div onClick={() => navigate('/officer/rejected')} style={{ cursor: 'pointer' }}>
                    <StatCard 
                        title="Rejected" 
                        value={counts.rejected} 
                        icon="❌" 
                        color="#e74c3c" 
                    />
                </div>
            </div>
        </div>
    );
};

export default OfficerDashboard;