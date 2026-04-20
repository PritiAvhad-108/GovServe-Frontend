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
        
        <div className="pending-page-wrapper">
            <div className="pending-container">
                
                
                <div className="pending-header">
                    <h2 className="page-title">Pending Applications</h2>
    
                </div>

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
                                            <td style={{ fontWeight: '600' }}> {item.caseId}</td>
                                            
                                          
                                            <td>
                                                {
                                                    item.user?.fullName || 
                                                    item.User?.fullName || 
                                                    item.application?.citizenDetails?.fullName || 
                                                    item.application?.User?.fullName || 
                                                    'N/A'
                                                }
                                            </td>
                                            
                                            <td>{item.application?.service?.serviceName || 'General Service'}</td>
                                            
                                            <td className="status-pending">
                                                <span>Pending</span>
                                            </td>
                                            
                                            <td>
                                                <button
                                                    className="view-btn"
                                                    onClick={() => navigate(`/officer/case-details/${item.caseId}`)}
                                                >
                                                    View Application
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
        </div>
    );
};

export default PendingCasesPage;