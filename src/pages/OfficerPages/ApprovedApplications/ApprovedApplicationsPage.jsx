import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCasesByStatus } from '../../../api/officerApi';
import Pagination from '../../Pagination'; // 🚨 IMPORTANT: Make sure this path points to your Pagination.jsx file!
import './ApprovedApplicationsPage.css'; 

const ApprovedApplicationsPage = () => {
    const [caseList, setCaseList] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // ✅ 1. ADD PAGINATION STATE
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // You can change this to 10 if you want!

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

    // ✅ 2. CALCULATE WHICH ITEMS TO SHOW ON THE CURRENT PAGE
    const totalPages = Math.ceil(caseList.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = caseList.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="approved-container">
            <h2 className="page-title">Approved Applications</h2>
            <p className="total-count">
                Total: {caseList.length} Applications
            </p>

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
                                {/* ✅ 3. USE 'currentItems' INSTEAD OF 'caseList' HERE */}
                                {currentItems.length > 0 ? (
                                    currentItems.map((item) => (
                                        <tr key={item.caseId}>
                                            <td>{item.caseId}</td>
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
                                            <td>
                                                {item.serviceName || item.application?.service?.serviceName || 'General Service'}
                                            </td>
                                            <td className="status-approved">
                                                Approved
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className="view-app-btn"
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
                                            No approved applications found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* ✅ 4. FEED THE PROPS TO THE PAGINATION COMPONENT */}
                        {!loading && caseList.length > 0 && (
                            <Pagination 
                                currentPage={currentPage} 
                                totalPages={totalPages} 
                                onPageChange={(newPage) => setCurrentPage(newPage)} 
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ApprovedApplicationsPage;