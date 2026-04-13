import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getResubmittedCases } from '../../../api/officerApi';
import Pagination from '../../../components/OfficerComponents/common/Pagination';
import './ResubmittedCases.css';

const ResubmittedCasesPage = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Static ID for now, should come from Auth Context/LocalStorage
    const officerId = localStorage.getItem('userId') || 1;

    useEffect(() => {
        fetchResubmitted();
    }, []);

    const fetchResubmitted = async () => {
        try {
            setLoading(true);
            const response = await getResubmittedCases(officerId);
            setCases(response.data);
        } catch (error) {
            console.error("Error fetching resubmitted cases:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (caseId) => {
        navigate(`/officer/case-details/${caseId}`);
    };

    return (
        <div className="resubmitted-page">
            <div className="page-header">
                <div>
                    <h1>Resubmitted Cases</h1>
                    <p>Applications corrected and sent back by citizens for re-verification.</p>
                </div>
                <button className="refresh-btn" onClick={fetchResubmitted}>Refresh List</button>
            </div>

            <div className="table-container">
                {loading ? (
                    <div className="loading-spinner">Loading resubmitted applications...</div>
                ) : (
                    <table className="resubmitted-table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Applicant Name</th>
                                <th>Service Name</th>
                                <th>Resubmitted Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.length > 0 ? (
                                cases.map((item) => (
                                    <tr key={item.caseId}>
                                        <td>#{item.caseId}</td>
                                        <td>{item.applicantName}</td>
                                        <td>{item.serviceName}</td>
                                        <td>{new Date(item.updatedDate || item.appliedDate).toLocaleDateString()}</td>
                                        <td>
                                            <span className="badge-resubmitted">Resubmitted</span>
                                        </td>
                                        <td>
                                            <button 
                                                className="process-btn"
                                                onClick={() => handleViewDetails(item.caseId)}
                                            >
                                                Process Case
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="no-data">No resubmitted cases found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="pagination-wrapper">
                <Pagination />
            </div>
        </div>
    );
};

export default ResubmittedCasesPage;