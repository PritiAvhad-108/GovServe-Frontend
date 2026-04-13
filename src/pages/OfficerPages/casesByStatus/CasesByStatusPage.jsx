import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCasesByStatus } from '../../../api/officerApi';
import Pagination from "../../../components/AdminComponents/common/Pagination";
import './CasesByStatus.css'; // MUST match your CSS file name

const CasesByStatusPage = ({ statusTitle }) => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Determine status: props मधून किंवा URL मधून ओळखा
    const currentStatus = statusTitle || (location.pathname.includes('approved') ? 'Approved' : 'Rejected');
    
    const officerId = localStorage.getItem('userId') || 2;

    useEffect(() => {
        fetchCases();
    }, [currentStatus, statusTitle]);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const response = await getCasesByStatus(officerId, currentStatus);
            const finalData = response.data || response;

            if (Array.isArray(finalData)) {
                // 🚨 CRITICAL FIX: Force the frontend to ONLY keep cases that match the current tab
                // This prevents "Approved" cases from showing on the "Rejected" page!
                const strictlyFilteredCases = finalData.filter(c => c.status === currentStatus);
                setCases(strictlyFilteredCases);
            } else {
                setCases([]);
            }

        } catch (error) {
            console.error(`Error fetching ${currentStatus} cases:`, error);
            setCases([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="status-page-container">
            <div className="status-header">
                <h2>{currentStatus} Applications</h2>
                <div className="custom-breadcrumb">Officer / {currentStatus} Cases</div>
            </div>

            <div className="status-card">
                {loading ? (
                    <div className="loading-text">
                        Loading {currentStatus} cases...
                    </div>
                ) : (
                    <table className="status-table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Applicant Name</th>
                                <th>Service</th>
                                <th>Action Date</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.length > 0 ? (
                                cases.map((c) => (
                                    <tr key={c.caseId}>
                                        <td style={{ fontWeight: '600' }}># {c.caseId}</td>
                                        
                                        {/* ✅ UPDATED: Look inside the user object for the name */}
                                        <td>{c.user?.fullName || 'N/A'}</td>
                                        
                                        {/* ✅ UPDATED: Look inside the application object for the service */}
                                        <td>{c.application?.service?.serviceName || c.application?.serviceName || 'General'}</td>
                                        
                                        {/* ✅ UPDATED: Use completedDate or assignedDate directly from database */}
                                        {/* ✅ NEW DATE CODE (Shows the exact applied date) */}
<td>
    {c.application?.submittedDate 
        ? new Date(c.application.submittedDate).toLocaleDateString('en-GB') 
        : 'N/A'}
</td>
                                        <td>
                                            {/* 🚨 CRITICAL FIX: Changed from "badge" to "status-pill" to block Bootstrap */}
                                            <span className={`status-pill status-${c.status.toLowerCase()}`}>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <button 
                                                className="view-link-btn"
                                                onClick={() => navigate(`/officer/case-details/${c.caseId}`)}
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="empty-row">
                                        No {currentStatus} cases available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
            {cases.length > 0 && <Pagination />}
        </div>
    );
};

export default CasesByStatusPage;