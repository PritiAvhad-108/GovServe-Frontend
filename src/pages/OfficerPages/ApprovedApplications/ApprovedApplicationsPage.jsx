import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCasesByStatus } from '../../../api/officerApi';
import './ApprovedApplicationsPage.css'; 

const ApprovedApplicationsPage = () => {
    const [caseList, setCaseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const officerId = localStorage.getItem('userId') || 2;

    useEffect(() => {
        const fetchApproved = async () => {
            try {
                setLoading(true);
                const data = await getCasesByStatus(officerId, 'Approved');
                const finalData = data.data || data;
                setCaseList(Array.isArray(finalData) ? finalData : []);
            } catch (error) {
                console.error('Error fetching approved cases:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchApproved();
    }, [officerId]);

    return (
        <div className="approved-container">
            {/* Header */}
            <h2 className="page-title">Approved Applications</h2>
            <p className="custom-breadcrumb">Officer / Approved Cases</p>
            <p className="total-count">
                Total: {caseList.length} Applications
            </p>

            {/* Card */}
            <div className="approved-card">
                {loading ? (
                    <div className="loading-text">Loading...</div>
                ) : (
                    <>
                        <table className="approved-table-new">
                            <thead>
                                <tr>
                                    <th>Case ID</th>
                                    <th>Applicant Name</th>
                                    <th>Service Type</th>
                                    <th>Status</th>
                                    <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {caseList.length > 0 ? (
                                    caseList.map((item) => (
                                        <tr key={item.caseId}>
                                            <td>#{item.caseId}</td>
                                            <td>
                                                {/* FIXED: Priority mapping for Applicant Name */}
                                                {item.user?.fullName || item.fullName || item.application?.citizenDetails?.fullName || 'N/A'}
                                            </td>
                                            <td>
                                                {item.serviceName || 'General Service'}
                                            </td>
                                            <td className="status-approved">
                                                Approved
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className="view-app-btn"
                                                    onClick={() =>
                                                        navigate(`/officer/case-details/${item.caseId}`)
                                                    }
                                                >
                                                    View Application
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="empty-text">
                                            No approved applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* Updated: Pagination Section with Blue Button Labels */}
                        {!loading && caseList.length > 0 && (
                            <div className="custom-pagination">
                                <button className="page-nav-btn" disabled>
                                    Previous
                                </button>
                                <span className="page-info">Page 1 of 1</span>
                                <button className="page-nav-btn" disabled={caseList.length <= 10}>
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApprovedApplicationsPage;