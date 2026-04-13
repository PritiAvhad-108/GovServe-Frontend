import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCasesByStatus } from '../../../api/officerApi';
import './PendingCasesPage.css';

const PendingCasesPage = () => {
    const [pendingCases, setPendingCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const officerId = localStorage.getItem('userId') || 2;

    useEffect(() => {
        const fetchPendingCases = async () => {
            try {
                setLoading(true);
                // 🚨 CRITICAL: Check your C# database. 
                // If the status is saved as 'Under Verification', change 'Pending' to 'Under Verification' here!
                const response = await getCasesByStatus(officerId, 'Pending');
                const data = response.data || response;
                setPendingCases(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching pending cases:', error);
                setPendingCases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingCases();
    }, [officerId]);

    return (
        <div className="pending-container">
            {/* Header */}
            <h2 className="page-title">Pending Applications</h2>
            <p className="breadcrumb">Officer / Pending Review</p>
            <p className="total-count">Total: {pendingCases.length} Applications</p>

            {/* Card Table */}
            <div className="pending-card">
                {loading ? (
                    <div className="loading-text">Loading pending cases...</div>
                ) : (
                    <table className="pending-table">
                        <thead>
                            <tr>
                                <th>CASE ID</th>
                                <th>APPLICANT NAME</th>
                                <th>SERVICE TYPE</th>
                                <th>STATUS</th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pendingCases.length > 0 ? (
                                pendingCases.map((item) => (
                                    <tr key={item.caseId}>
                                        <td style={{ fontWeight: '600' }}># {item.caseId}</td>
                                        
                                        <td>{item.user?.fullName || 'N/A'}</td>
                                        
                                        <td>{item.application?.service?.serviceName || 'General Service'}</td>
                                        
                                        <td className="status-pending">
                                            <span>Pending</span>
                                        </td>
                                        
                                        <td>
                                            {/* ✅ Fixed: The comment is now safely outside the button tag */}
                                            <button
                                                className="view-btn"
                                                onClick={() => navigate(`/officer/case-details/${item.caseId}`)}
                                            >
                                                Review Application
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-text">
                                        No Pending cases available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default PendingCasesPage;