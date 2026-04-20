import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAssignedCases } from '../../../api/officerApi';
import './AssignedCases.css';
 
const AssignedCasesPage = () => {
    const [caseList, setCaseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
 
 
    const rawUserId = localStorage.getItem('userId');
    const officerId = rawUserId ? rawUserId.toString().split(':')[0] : 2;
 
    useEffect(() => {
        fetchData();
    }, [officerId]);
 
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getAssignedCases(officerId);
           
           
            const finalData = response.data || response;
            setCaseList(Array.isArray(finalData) ? finalData : []);
           
        } catch (error) {
            console.error("Data Fetching Error:", error);
            setCaseList([]);
        } finally {
            setLoading(false);
        }
    };
 
    return (
        <div className="assigned-container">
           
           
            <div className="assigned-header">
                <h1 className="text-2xl font-bold text-gray-800">Assigned Cases</h1>
               
            </div>
 
            <div className="table-wrapper">
                {loading ? (
                    <div className="p-10 text-center">Loading cases...</div>
                ) : (
                    <table className="assigned-table">
                        <thead>
                            <tr>
                                <th>Case ID</th>
                                <th>Applicant Name</th>
                                <th>Service Type</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {caseList.length > 0 ? (
                                caseList.map((item) => (
                                    <tr key={item.caseId}>
                                        <td className="font-medium">{item.caseId}</td>
                                       
                                       
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
                                       
                                        <td>
                                            <span className={`status-badge status-${item.status?.toLowerCase()}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                       
                                        <td>
                                            <div className="flex gap-2 justify-center">
                                               
                                               
                                                <button
                                                    onClick={() => navigate(`/officer/case-details/${item.caseId}`)}
                                                    className="view-btn"
                                                    style={{
                                                        backgroundColor: '#2563eb',
                                                        color: 'white',
                                                        padding: '8px 16px',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: '600',
                                                        fontSize: '13px'
                                                    }}
                                                >
                                                    View Application
                                                </button>
                                               
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10" style={{ color: '#94a3b8' }}>
                                        No cases assigned yet.
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
 
export default AssignedCasesPage;