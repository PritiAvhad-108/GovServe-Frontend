import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCasesByStatus } from '../../../api/officerApi'; 
import './RejectedCasesPage.css'; 

const RejectedCasesPage = () => {
    const [rejectedCases, setRejectedCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const officerId = localStorage.getItem('userId') || 2; 

    useEffect(() => {
        const fetchRejectedCases = async () => {
            try {
                setLoading(true);
                const response = await getCasesByStatus(officerId, 'Rejected');
                const data = response.data || response;
                
                if (Array.isArray(data)) {
                    const strictlyRejected = data.filter(item => item.status === 'Rejected');
                    setRejectedCases(strictlyRejected);

                    // 👇 ADDED: Console log to inspect the C# response
                    console.log("🕵️‍♂️ REJECTED LIST DATA FROM C#:", strictlyRejected);

                } else {
                    setRejectedCases([]);
                }
            } catch (error) {
                console.error("Error fetching rejected cases:", error);
                setRejectedCases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRejectedCases();
    }, [officerId]);

    return (
        /* ✅ NEW: Global wrapper to center the page horizontally */
        <div className="rejected-page-wrapper">
            <div className="rejected-page-container">
                
                {/* 🚨 FIX: Centered Header */ }
                <div className="rejected-header">
                    <h2>Rejected Applications</h2>
                    <p className="custom-breadcrumb">Officer / Rejected Cases</p>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="loading-state">Loading rejected cases...</div>
                    ) : (
                        <table className="reference-table">
                            <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Applicant Name</th>
                                    <th>Service</th>
                                    <th>Action Date</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rejectedCases.length > 0 ? (
                                    rejectedCases.map((item) => (
                                        <tr key={item.caseId}>
                                            <td style={{ fontWeight: '600' }}>{item.caseId}</td>
                                            
                                            {/* 🚨 THE FIX FOR THE MISSING NAME 🚨 */}
                                            <td>
                                                {
                                                    item.user?.fullName || 
                                                    item.User?.fullName || 
                                                    item.application?.citizenDetails?.fullName || 
                                                    item.application?.User?.fullName || 
                                                    item.fullName || 
                                                    'N/A'
                                                }
                                            </td>
                                            
                                            <td>{item.serviceName || item.application?.serviceName || 'N/A'}</td>
                                            <td>
                                                {item.actionDate || item.updatedDate 
                                                    ? new Date(item.actionDate || item.updatedDate).toLocaleDateString('en-GB') 
                                                    : 'N/A'}
                                            </td>
                                            <td>
                                                <span className="rejected-pill">
                                                    Rejected
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button 
                                                    className="reference-view-btn"
                                                    onClick={() => navigate(`/officer/case-details/${item.caseId}`)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="empty-table-row">
                                            No Rejected cases available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RejectedCasesPage;