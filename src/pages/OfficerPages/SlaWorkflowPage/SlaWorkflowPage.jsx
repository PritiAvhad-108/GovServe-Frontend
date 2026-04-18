import React, { useEffect, useState } from 'react';
import { getOfficerDetailedDashboard } from '../../../api/officerApi';
import './SlaWorkflowPage.css';

const SlaWorkflowPage = () => {
    const [slaCases, setSlaCases] = useState([]);
    const [loading, setLoading] = useState(true);

    const officerId = localStorage.getItem('userId') || 2; 

    useEffect(() => {
        const fetchSlaData = async () => {
            try {
                setLoading(true);
                const response = await getOfficerDetailedDashboard(officerId);
                const data = response.data || response;
                
                const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => a.daysRemaining - b.daysRemaining);
                
                setSlaCases(sortedData);
            } catch (error) {
                console.error("Error fetching SLA dashboard:", error);
                setSlaCases([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlaData();
    }, [officerId]);

    const getUrgencyColorClass = (urgencyLevel) => {
        switch (urgencyLevel) {
            case 'Breached': return 'urgency-breached';
            case 'Critical': return 'urgency-critical';
            case 'OnTime': default: return 'urgency-ontime';
        }
    };

    return (
        /* ✅ NEW: Global wrapper to center the page */
        <div className="sla-page-wrapper">
            <div className="sla-workflow-container">
                
                {/* 🚨 FIX: Header is now grouped and centered via CSS */}
                <div className="officer-sla-header">
                    <h2>SLA Record</h2>
                    <div className="custom-breadcrumb"></div>
                </div>

                {/* The white card */}
                <div className="sla-card">
                    {loading ? (
                        <div className="sla-loading">Loading SLA metrics...</div>
                    ) : (
                        <div className="sla-table-responsive">
                            <table className="sla-table">
                                <thead>
                                    <tr>
                                        <th>CASE ID</th>
                                        <th>SERVICE</th>
                                        <th>STATUS</th>
                                        <th>DAYS REMAINING</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {slaCases.length > 0 ? (
                                        slaCases.map((c) => (
                                            <tr key={c.caseId}>
                                                <td className="sla-cell-bold"> {c.caseId}</td>
                                                <td>{c.applicationName || 'N/A'}</td>
                                                <td>
                                                    <span className={`sla-status-pill status-${c.status?.toLowerCase() || 'pending'}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                
                                                {/* ✅ UPDATED: Conditional rendering for 0 days = Breached */}
                                               {/* ✅ UPDATED: Conditional rendering for 0 OR LESS days = Breached */}
<td>
    <span 
        className={`sla-days ${getUrgencyColorClass(c.urgencyLevel)}`}
        style={c.daysRemaining <= 0 ? { color: '#e74c3c', fontWeight: 'bold' } : {}}
    >
        {c.daysRemaining <= 0 
            ? 'Breached' 
            : `${c.daysRemaining} ${c.daysRemaining === 1 ? 'Day' : 'Days'}`
        }
    </span>
</td>
                                                
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="sla-empty">
                                                No pending SLA records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SlaWorkflowPage;