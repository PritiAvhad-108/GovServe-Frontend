import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import DocumentPreview from "../../components/GrievanceComponents/common/DocumentPreview";

import {
  getCaseDetailsByCaseId,
  getCaseIdByApplicationId,
  getDocumentsByApplicationId
} from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/GrievanceCaseDetail.css";

const GrievanceCaseDetail = () => {
  const { id } = useParams();    // Application ID
  const navigate = useNavigate();

  const [caseId, setCaseId] = useState(null);
  const [details, setDetails] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocUrl, setSelectedDocUrl] = useState(null);

  //  Application ID → Case ID
  useEffect(() => {
    const fetchCaseId = async () => {
      try {
        setLoading(true);
        const response = await getCaseIdByApplicationId(id);
        setCaseId(response.data.caseId);
      } catch (error) {
        console.error("Failed to fetch caseId:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseId();
  }, [id]);

  //  Case ID → Case Details
  useEffect(() => {
    if (!caseId) return;

    const fetchCaseDetails = async () => {
      try {
        setLoading(true);
        const res = await getCaseDetailsByCaseId(caseId);
        setDetails(res.data);
       getDocumentsByApplicationId(id);
      } catch (error) {
        console.error("Failed to fetch case details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseDetails();
  }, [caseId]);


  //  DOCUMENT FETCH useEffect 
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await getDocumentsByApplicationId(id);
        console.log("Documents API response:", res.data);
        setDocuments(res.data || []);
      } catch (error) {
        console.error("Failed to fetch grievance documents:", error);
      }
    };
    
if (id) {
      fetchDocuments();
    }
  }, [id]);



  if (loading) {
    return (
      <div className="application-page">
        <div className="case-detail-container">
          <p>Loading case details...</p>
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="application-page">
        <div className="case-detail-container">
          <p>Case details not found.</p>
        </div>
      </div>
    );
  }

  
  return (
    <div className="application-page">
      {/*  INNER WRAPPER FOR ALIGNMENT */}
      <div className="case-detail-container">

        {/* Header */}
        <div className="app-header">
          <button className="back-icon" onClick={() => navigate(-1)}>←</button>
          <h2>Case Details</h2>
        </div>

        <div className="app-id">Application ID: {id}</div>

        {/*  Service Overview */}
        <div className="card">
          <h3 className="card-title">Service Overview</h3>

          <div className="overview-grid">
            <div>
              <label>Applied Service</label>
              <p>{details.serviceName ||
              details.application?.service?.serviceName ||
                                details.application?.serviceName ||
                                'N/A'}</p>
            </div>

            <div>
              <label>Department</label>
              <p>{details.departmentName || "-"}</p>
            </div>

            <div>
              <label>Current Status</label>
              <span className={`status-pill ${details.status?.toLowerCase()}`}>
                {details.status || "-"}
              </span>
            </div>

            <div>
              <label>Submission Date</label>
              <p>
                {details.assignedDate
                  ? new Date(details.assignedDate).toLocaleString()
                  : "-"}
              </p>
            </div>
          </div>
        </div>

        {/*  Citizen Personal Details */}
        <div className="card">
          <h3 className="card-title">Citizen Personal Details</h3>

          <div className="citizen-grid">
            <div>
              <label>Full Name</label>
              <p>{details.fullName || "-"}</p>
            </div>

            <div>
              <label>Gender</label>
              <p>{details.gender || "-"}</p>
            </div>

            <div>
              <label>Date of Birth</label>
              <p>
                {details.dateOfBirth
                  ? new Date(details.dateOfBirth).toLocaleDateString()
                  : "-"}
              </p>
            </div>

            <div>
              <label>Father's Name</label>
              <p>{details.fatherName || "-"}</p>
            </div>

            <div>
              <label>Mother's Name</label>
              <p>{details.motherName || "-"}</p>
            </div>

            <div>
              <label>Email Address</label>
              <p>{details.email || "-"}</p>
            </div>

            <div>
              <label>Phone Number</label>
              <p>{details.phone || "-"}</p>
            </div>

            <div className="full-width">
              <label>Address</label>
              <p>
                {[details.addressLine1, details.city, details.state, details.pincode]
                  .filter(Boolean)
                  .join(", ") || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* Uploaded Documents */}
<div className="card">
  <h3 className="card-title">Uploaded Documents</h3>

  {documents.length > 0 ? (
    <div className="document-section-layout">

      {/* LEFT – DOCUMENT LIST */}
      <div className="document-list">
        {documents.map((doc, index) => {

          // ✅ Handle all possible backend keys
          const filePath =
            doc.documentUrl || doc.uri || doc.URI || "";

          // ✅ Normalize path
          const cleanPath = filePath
            ? filePath.startsWith("/")
              ? filePath
              : `/${filePath}`
            : "";

          const fullUrl = cleanPath
            ? `https://localhost:7027${cleanPath}`
            : null;

          const isActive = selectedDocUrl === fullUrl;

          return (
            <div
              key={doc.documentId || index}
              className={`doc-row ${isActive ? "active-row" : ""}`}
            >
              <div className="doc-info">
                <span className="doc-icon">📄</span>
                <span className="doc-name">
                  {doc.documentName || `Document ${index + 1}`}
                </span>
              </div>

              <button
                className="doc-action-btn view-btn"
                onClick={() => setSelectedDocUrl(fullUrl)}
                //disabled={!fullUrl}
              >
                View
              </button>
            </div>
          );
        })}
      </div>

      {/* RIGHT – DOCUMENT PREVIEW */}
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
      </div>
    </div>
  );
};

export default GrievanceCaseDetail;