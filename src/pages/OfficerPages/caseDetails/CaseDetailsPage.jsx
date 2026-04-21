import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentPreview from '../../../components/OfficerComponents/common/DocumentPreview';
 
import Swal from 'sweetalert2';
import { getCaseDetails, getDocumentsByApplicationId, approveCase, rejectCase, markCaseAsPending, approveDocument, rejectDocument } from '../../../api/officerApi';

import './CaseDetails.css';
 
const CaseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
 
    const [details, setDetails] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    
    const [selectedDocUrl, setSelectedDocUrl] = useState(null); 
    const [docStatuses, setDocStatuses] = useState({}); 
    
    useEffect(() => {
        const fetchMainDetails = async () => {
            try {
                setPageLoading(true);
                const response = await getCaseDetails(id);
                setDetails(response.data || response);
            } catch (error) {
                console.error("Failed to fetch case details:", error);
            } finally {
                setPageLoading(false);
            }
        };
        fetchMainDetails();
    }, [id]);
    
    const applicationId = details?.applicationID || details?.application?.applicationID;
    
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await getDocumentsByApplicationId(applicationId);
               
                setDocuments(response.data || []);
            } catch (error) {
                console.error("Failed to fetch documents", error);
            }
        };
 
        if (applicationId) {
            fetchDocuments();
        }
    }, [applicationId]);
 
    const handleApproveApplication = async () => {
        const result = await Swal.fire({
            title: "Approve Application?",
            text: "Are you sure you want to officially approve this application? This action will update the case status.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#2ecc71",
            cancelButtonColor: "#6c757d",  
            confirmButtonText: "Yes, Approve it!",
            cancelButtonText: "Cancel"
        });
 
        if (!result.isConfirmed) return;
 
        try {
            await approveCase(id);
           
            await Swal.fire({
                title: "Success!",
                text: "Application Approved Successfully! Notifications have been sent.",
                icon: "success",
                confirmButtonColor: "#1e3a8a",
                timer: 2000,
                showConfirmButton: false
            });
           
            navigate('/officer/approved');
        } catch (error) {
            console.error("Error approving application:", error);
            Swal.fire({
                title: "Error",
                text: "Failed to approve application. Please check the console.",
                icon: "error",
                confirmButtonColor: "#dc3545"
            });
        }
    };
    const handleRejectApplication = async () => {
        const { value: reason, isConfirmed } = await Swal.fire({
            title: "Reject Application",
            input: "textarea",
            inputLabel: "Reason for Rejection *",
            inputPlaceholder: "Type your reason here...",
            inputAttributes: { "aria-label": "Type your reason here" },
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Submit Rejection",
            cancelButtonText: "Cancel",
            inputValidator: (value) => {
                if (!value) return "You need to write a reason!";
            }
        });
 
        if (!isConfirmed) return;
 
        try {
            await rejectCase(id, reason);
           
            await Swal.fire({
                title: "Rejected!",
                text: "Application Rejected Successfully!",
                icon: "success",
                confirmButtonColor: "#1e3a8a",
                timer: 2000,
                showConfirmButton: false
            });
           
            navigate('/officer/rejected');
        } catch (error) {
            console.error("Error rejecting application:", error);
            Swal.fire("Error", "Failed to reject application.", "error");
        }
    };
 
    const handleStartVerification = async () => {
        try {
            await markCaseAsPending(id);
            await Swal.fire({
                title: "Verification Started!",
                text: "This case is now in your Pending Review list.",
                icon: "info",
                timer: 2000,
                showConfirmButton: false
            });
            setDetails(prev => ({ ...prev, status: 'Under Verification' }));
        } catch (error) {
            Swal.fire("Error", "Failed to move case to pending status.", "error");
        }
    };

    
    const handleDocumentStatusUpdate = async (primaryKeyId, newStatus) => {
        
    
        if (!primaryKeyId) {
            Swal.fire("Error", `Could not find the ID. Check console!`, "error");
            return;
        }

        try {
            if (newStatus === 'Approved') {
                await approveDocument(primaryKeyId);
            } else if (newStatus === 'Rejected') {
                await rejectDocument(primaryKeyId);
            }

            setDocStatuses(prev => ({ ...prev, [primaryKeyId]: newStatus }));
            
            Swal.fire({
                title: `Document ${newStatus}!`,
                icon: newStatus === 'Approved' ? 'success' : 'error',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000
            });

        } catch (error) {
            console.error(`Error updating document:`, error);
            Swal.fire("Error", "Failed to update document status in the database.", "error");
        }
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
                    <div>
                        <label>Applied Service</label>
                        <p className="detail-value">
                            {details.serviceName || details.application?.service?.serviceName || details.application?.serviceName || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <label>Department</label>
                        <p className="detail-value">{details.departmentName || details.department || 'Revenue Department'}</p>
                    </div>
                    <div>
                        <label>Current Status</label>
                        <span className={`status-pill ${details.status?.toLowerCase()}`}>
                            {details.status || 'Pending'}
                        </span>
                    </div>
                    <div>
                        <label>Submission Date</label>
                        <p className="detail-value">
                            {details.assignedDate ? new Date(details.assignedDate).toLocaleString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
 
            {/* CITIZEN DETAILS */}
            <div className="card">
                <h3 className="card-title">Citizen Personal Details</h3>
                <div className="citizen-grid">
                    <div className="grid-item"><label>Full Name</label><p>{details.fullName || '-'}</p></div>
                    <div className="grid-item"><label>Gender</label><p>{details.gender || '-'}</p></div>
                    <div className="grid-item">
                        <label>Date of Birth</label>
                        <p>{details.dateOfBirth ? new Date(details.dateOfBirth).toLocaleDateString() : '-'}</p>
                    </div>
                    <div className="grid-item"><label>Father's Name</label><p>{details.fatherName || '-'}</p></div>
                    <div className="grid-item"><label>Mother's Name</label><p>{details.motherName || '-'}</p></div>
                    <div className="grid-item"><label>Email Address</label><p>{details.email || '-'}</p></div>
                    <div className="grid-item"><label>Phone Number</label><p>{details.phone || details.phoneNumber || '-'}</p></div>
                    <div className="grid-item full-width">
                        <label>Residential Address</label>
                        <p>
                            {[details.addressLine1, details.city, details.state, details.pincode].filter(Boolean).join(', ') || '-'}
                        </p>
                    </div>
                </div>
            </div>
 
            {/* DOCUMENTS SECTION */}
            <div className="card">
                <h3 className="card-title">Uploaded Documents</h3>
               
                <div className="verification-trigger-section" style={{ marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '20px' }}>
                    <button
                        className="verify-btn"
                        onClick={handleStartVerification}
                        style={{ backgroundColor: '#0ea5e9', color: 'white', padding: '6px 14px', fontSize: '13px', borderRadius: '6px', border: 'none', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
                                const filePath = doc.documentUrl || doc.uri || doc.URI || "";
                                const cleanPath = filePath ? (filePath.startsWith('/') ? filePath : `/${filePath}`) : "";
                                const fullUrl = cleanPath ? `https://localhost:7027${cleanPath}` : null;
                                const isCurrentlyViewing = selectedDocUrl === fullUrl;
                                
                                
                                let primaryKey = null;
                                for (let key in doc) {
                                    if (key.toLowerCase() === 'citizendocumentid') {
                                        primaryKey = doc[key];
                                        break;
                                    }
                                }

                                
                                if (!primaryKey) {
                                    console.error("COULD NOT FIND CitizenDocumentID! Object looks like:", doc);
                                    primaryKey = doc.documentId; 
                                }
                                
                                const currentStatus = docStatuses[primaryKey] || doc.verificationStatus || doc.VerificationStatus || doc.status || doc.Status || 'Pending';

                                return (
                                    <div key={primaryKey || index} className={`doc-row ${isCurrentlyViewing ? 'active-row' : ''}`}>
                                        <div className="doc-info">
                                            <span className="doc-icon">📄</span>
                                            <span className="doc-name">{doc.documentName || `Document ${index + 1}`}</span>
                                        </div>
                                        
                                        <div className="doc-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            
                                            <button 
                                                className="doc-action-btn view-btn" 
                                                onClick={() => setSelectedDocUrl(fullUrl)}
                                                style={{ backgroundColor: '#2563eb', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '13px' }}
                                            >
                                                View
                                            </button>

                                            <button 
                                                onClick={() => handleDocumentStatusUpdate(primaryKey, 'Approved')}
                                                title="Approve Document"
                                                style={{ backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                                            >
                                                ✅
                                            </button>

                                            <button 
                                                onClick={() => handleDocumentStatusUpdate(primaryKey, 'Rejected')}
                                                title="Reject Document"
                                                style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer' }}
                                            >
                                                ❌
                                            </button>

                                            <span style={{ 
                                                fontWeight: 'bold', fontSize: '13px', padding: '4px 8px', borderRadius: '12px',
                                                backgroundColor: currentStatus === 'Approved' ? '#dcfce7' : currentStatus === 'Rejected' ? '#fee2e2' : '#f1f5f9',
                                                color: currentStatus === 'Approved' ? '#166534' : currentStatus === 'Rejected' ? '#991b1b' : '#475569'
                                            }}>
                                                {currentStatus}
                                            </span>

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
 
            <div className="action-buttons">
                <button className="approve-btn" onClick={handleApproveApplication}>Approve</button>
                <button className="reject-btn" onClick={handleRejectApplication}>Reject</button>
            </div>
 
        </div>
    );
};
 
export default CaseDetailsPage;
 