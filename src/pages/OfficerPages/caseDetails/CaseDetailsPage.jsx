import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentPreview from '../../../components/OfficerComponents/common/DocumentPreview';
import ActionModal from '../../../components/OfficerComponents/common/ActionModal';
// ✅ ADDED markCaseAsPending to the imports
import { getCaseDetails, getDocumentsByApplicationId, approveCase, rejectCase, markCaseAsPending } from '../../../api/officerApi';
import './CaseDetails.css';
 
const CaseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
 
    const [details, setDetails] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
 
    const [selectedDocUrl, setSelectedDocUrl] = useState(null);
    const [docStatuses, setDocStatuses] = useState({});
   
    // =================================================================
    // ✅ FIX 1: Fetch the main Case Details when the page loads
    // =================================================================
    useEffect(() => {
        const fetchMainDetails = async () => {
            try {
                setPageLoading(true);
                // Call your API to get the case data based on the URL id
                const response = await getCaseDetails(id);
                setDetails(response.data || response);
 
                // 👇 ADDED: Log the exact data structure from C# to the console
                console.log("🕵️‍♂️ RAW DATA FROM C#:", response.data || response);
 
            } catch (error) {
                console.error("Failed to fetch case details:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchMainDetails();
    }, [id]);
   
    // 🚨 REMOVED the useOfficerActions hook to handle it directly below
    const applicationId = details?.applicationID || details?.application?.applicationID;
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await getDocumentsByApplicationId(applicationId);
                // Ensure it sets an array even if the response is weird
                setDocuments(response.data || []);
            } catch (error) {
                console.error("Failed to fetch documents", error);
            }
        };
 
        if (applicationId) {
            fetchDocuments();
        }
    }, [applicationId]);
 
    // --- ✅ NEW LOGIC FOR APPROVING THE WHOLE APPLICATION ---
    const handleApproveApplication = async () => {
        const confirmApprove = window.confirm("Are you sure you want to APPROVE this application?");
        if (!confirmApprove) return;
 
        try {
            await approveCase(id); // Calls your API
            alert("Application Approved Successfully! Notifications have been sent.");
            // ✅ FIX: Navigates to the exact path your Sidebar uses
            navigate('/officer/approved');
        } catch (error) {
            console.error("Error approving application:", error);
            alert("Failed to approve application. Please check the console.");
        }
    };
 
    // --- ✅ NEW LOGIC FOR REJECTING THE WHOLE APPLICATION ---
    const handleRejectApplication = async (reason) => {
        try {
            await rejectCase(id, reason); // Calls your API with the reason from the modal
            alert("Application Rejected Successfully! Notifications have been sent.");
            setIsModalOpen(false); // Close Modal
            // ✅ FIX: Navigates to the exact path your Sidebar uses
            navigate('/officer/rejected');
        } catch (error) {
            console.error("Error rejecting application:", error);
            alert("Failed to reject application. Please check the console.");
        }
    };
 
    // --- ✅ ADDED: LOGIC FOR MOVING TO PENDING REVIEW ---
    const handleStartVerification = async () => {
        try {
            await markCaseAsPending(id);
            alert("Verification Started! This case is now in your Pending Review list.");
            // Optionally update local UI immediately
            setDetails(prev => ({ ...prev, status: 'Under Verification' }));
        } catch (error) {
            console.error("Error updating to pending:", error);
            alert("Failed to move case to pending status.");
        }
    };
 
    const handleDocAction = (docId, status) => {
        setDocStatuses(prev => ({ ...prev, [docId]: status }));
    };
 
    if (pageLoading) return <div className="p-10">Loading application details...</div>;
    if (!details) return <div className="p-10">Case details not found.</div>;
 
    return (
        <div className="application-page">
 
            <div className="app-header">
                <button className="back-icon" onClick={() => navigate(-1)}>←</button>
                <h2>Application Review</h2>
            </div>
 
            <div className="app-id">Application ID: {id}</div>
 
            {/* SERVICE OVERVIEW */}
            <div className="card">
                <h3 className="card-title">Service Overview</h3>
                <div className="overview-grid">
                    {/* Service Name */}
                    <div>
                        <label>Applied Service</label>
                        <p className="detail-value">
                            {/* 🚨 THE FIX: Dig deeper to find the real service name! */}
                            {
                                details.serviceName ||
                                details.application?.service?.serviceName ||
                                details.application?.serviceName ||
                                'N/A'
                            }
                        </p>
                    </div>
 
                    {/* Department Name */}
                    <div>
                        <label>Department</label>
                        <p className="detail-value">
                            {details.departmentName || details.department || 'Revenue Department'}
                        </p>
                    </div>
 
                    {/* Current Status */}
                    <div>
                        <label>Current Status</label>
                        <span className={`status-pill ${details.status?.toLowerCase()}`}>
                            {details.status || 'Pending'}
                        </span>
                    </div>
 
                    {/* Submission Date */}
                    <div>
                        <label>Submission Date</label>
                        <p className="detail-value">
                            {details.assignedDate
                                ? new Date(details.assignedDate).toLocaleString()
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
 
            {/* CITIZEN DETAILS */}
            <div className="card">
                <h3 className="card-title">Citizen Personal Details</h3>
                <div className="citizen-grid">
                    <div className="grid-item">
                        <label>Full Name</label>
                        <p>{details.fullName || '-'}</p>
                    </div>
                    <div className="grid-item">
                        <label>Gender</label>
                        <p>{details.gender || '-'}</p>
                    </div>
                    <div className="grid-item">
                        <label>Date of Birth</label>
                        <p>
                            {details.dateOfBirth
                                ? new Date(details.dateOfBirth).toLocaleDateString()
                                : '-'}
                        </p>
                    </div>
                    <div className="grid-item">
                        <label>Father's Name</label>
                        <p>{details.fatherName || '-'}</p>
                    </div>
                    <div className="grid-item">
                        <label>Mother's Name</label>
                        <p>{details.motherName || '-'}</p>
                    </div>
                    <div className="grid-item">
                        <label>Email Address</label>
                        <p>{details.email || '-'}</p>
                    </div>
                    <div className="grid-item">
                        <label>Phone Number</label>
                        <p>{details.phone || details.phoneNumber || '-'}</p>
                    </div>
                    <div className="grid-item full-width">
                        <label>Residential Address</label>
                        <p>
                            {[details.addressLine1, details.city, details.state, details.pincode]
                                .filter(Boolean)
                                .join(', ') || '-'}
                        </p>
                    </div>
                </div>
            </div>
 
            {/* DOCUMENTS SECTION */}
            <div className="card">
                <h3 className="card-title">Uploaded Documents</h3>
               
                {/* ✅ ADDED: Start Verification Trigger Button Here */}
                <div className="verification-trigger-section" style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                    {/* ✅ UPDATED: Smaller size and changed color */}
                    <button
                        className="verify-btn"
                        onClick={handleStartVerification}
                        style={{
                            backgroundColor: '#0ea5e9', /* A nice professional light blue. You can change this hex code! */
                            color: 'white',
                            padding: '6px 14px',        /* Reduced padding makes the button smaller */
                            fontSize: '13px',           /* Slightly smaller text */
                            borderRadius: '6px',
                            border: 'none',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'                  /* Space between the icon and the text */
                        }}
                    >
                     Start Document Verification
                    </button>
                    <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
                        Clicking this will update the status to "Under Verification" and move it to your Pending Review list.
                    </p>
                </div>
 
                {documents.length > 0 ? (
                    <div className="document-section-layout">
                        <div className="document-list">
                            {documents.map((doc, index) => {
                                const currentStatus = docStatuses[doc.documentId] || doc.status || 'Pending';
 
                                // 1. Log the document so we can see exactly what the backend sends
                                console.log("Document Data from backend:", doc);
 
                                // 2. ✅ FIX: Look for ALL possible capitalizations of URI
                                const filePath = doc.documentUrl || doc.uri || doc.URI || "";
 
                                // 3. ✅ FIX: Only build the URL if the file path actually exists
                                const cleanPath = filePath ? (filePath.startsWith('/') ? filePath : `/${filePath}`) : "";
                                const fullUrl = cleanPath ? `https://localhost:7027${cleanPath}` : null;
 
                                const isCurrentlyViewing = selectedDocUrl === fullUrl;
 
                                return (
                                    <div key={doc.documentId || index} className={`doc-row ${isCurrentlyViewing ? 'active-row' : ''}`}>
                                        <div className="doc-info">
                                            <span className="doc-icon">📄</span>
                                            <span className="doc-name">{doc.documentName || `Document ${index + 1}`}</span>
                                        </div>
                                        <div className="doc-controls">
                                            <button
                                                className="doc-action-btn view-btn"
                                                onClick={() => setSelectedDocUrl(fullUrl)}
                                            >
                                                View
                                            </button>
                   
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {selectedDocUrl && (
                            <div className="document-preview-box">
                                <h4>Document Preview</h4>
                                <div className="preview-frame">
                                    <DocumentPreview fileUrl={selectedDocUrl} />
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="no-doc">No documents uploaded.</p>
                )}
            </div>
 
            {/* ✅ ACTIONS: NOW WIRED TO THE NEW LOCAL FUNCTIONS */}
            <div className="action-buttons">
                <button className="approve-btn" onClick={handleApproveApplication}>Approve</button>
                <button className="reject-btn" onClick={() => setIsModalOpen(true)}>Reject</button>
            </div>
 
            {/* ✅ ACTION MODAL: PASSING THE REJECT FUNCTION */}
            <ActionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleRejectApplication}
                title="Reason for Rejection"
            />
        </div>
    );
};
 
export default CaseDetailsPage;
 