import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, FileText, Layout, MapPin, Mail, Phone, 
  Loader2, ExternalLink, UserCircle, ShieldCheck, 
  Calendar 
} from "lucide-react";
import "../../styles/CitizenStyles/pages/ApplicationDetails.css";

const ApplicationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullDetails = async () => {
     
      const token = localStorage.getItem("jwtToken");

    
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
      
        const res = await axios.get(`https://localhost:7027/api/Application/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setApp(res.data);
      } catch (err) {
        console.error("Error loading application data:", err);
    
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchFullDetails();
  }, [id, navigate]); 

  if (loading) return (
    <div className="loader-container">
      <Loader2 className="spin" size={40} />
      <p>Fetching complete application details...</p>
    </div>
  );

  if (!app) return <div className="error-msg">Application not found.</div>;

  return (
    <div className="content-wrapper">
      <div className="details-wrapper">
        
        <div className="back-button-bar">
          <button onClick={() => navigate(-1)} className="bar-back-btn" title="Go Back">
            <ArrowLeft size={20} />
          </button>
          <h2>Application Review</h2>
          <div className="placeholder-right"></div>
        </div>

       
        <div className="case-id-area">
            <span className="case-id">Application ID: {app.applicationId}</span>
        </div>

        
        <div className="sections-vertical-stack">
          
          {/* Service Overview */}
          <div className="details-card">
            <div className="card-header-icon">
              <Layout size={22} className="icon-blue" /> 
              <h3>Service Overview</h3>
            </div>
            <div className="info-display-grid">
              <div className="data-item">
                <label>Applied Service</label>
                <p>{app.serviceName}</p>
              </div>
              <div className="data-item">
                <label>Department</label>
                <p>{app.departmentName}</p>
              </div>
              <div className="data-item">
                <label>Current Status</label>
                <span className={`status-pill ${app.applicationStatus?.toLowerCase()}`}>
                  {app.applicationStatus}
                </span>
              </div>
              <div className="data-item">
                <label>Submission Date</label>
                <p><Calendar size={14} /> {new Date(app.submittedDate).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="details-card">
            <div className="card-header-icon">
              <UserCircle size={22} className="icon-blue" /> 
              <h3>Citizen Personal Details</h3>
            </div>
            <div className="info-display-grid">
              <div className="data-item"><label>Full Name</label><p>{app.citizenInfo?.fullName}</p></div>
              <div className="data-item"><label>Gender</label><p>{app.citizenInfo?.gender}</p></div>
              <div className="data-item"><label>Date of Birth</label><p>{new Date(app.citizenInfo?.dateOfBirth).toLocaleDateString()}</p></div>
              <div className="data-item"><label>Aadhaar Number</label><p><ShieldCheck size={14} /> {app.citizenInfo?.aadhaarNumber}</p></div>
              <div className="data-item"><label>Father's Name</label><p>{app.citizenInfo?.fatherName}</p></div>
              <div className="data-item"><label>Mother's Name</label><p>{app.citizenInfo?.motherName}</p></div>
              <div className="data-item"><label>Email Address</label><p><Mail size={14} /> {app.citizenInfo?.email}</p></div>
              <div className="data-item"><label>Phone Number</label><p><Phone size={14} /> {app.citizenInfo?.phone}</p></div>
              
              <div className="data-item full-row">
                <label>Residential Address</label>
                <p>
                  <MapPin size={14} /> {app.citizenInfo?.addressLine1}, {app.citizenInfo?.addressLine2}, 
                  {app.citizenInfo?.city}, {app.citizenInfo?.state} - {app.citizenInfo?.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Documents List */}
          <div className="details-card">
            <div className="card-header-icon">
              <FileText size={22} className="icon-blue" /> 
              <h3>Uploaded Documents</h3>
            </div>
            <div className="documents-list">
              {app.documents && app.documents.length > 0 ? (
                app.documents.map((doc, index) => (
                  <div key={index} className="document-strip">
                    <div className="doc-left">
                      <div className="doc-type-icon"><FileText size={20} /></div>
                      <div className="doc-meta">
                        <p className="doc-title">{doc.documentName}</p>
                        <span className="doc-sub">Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="doc-right">
                      <div className="doc-status-col">
                        <span className={`status-pill ${doc.verificationStatus?.toLowerCase()}`}>
                            {doc.verificationStatus}
                        </span>
                      </div>
                      <a href={`https://localhost:7027/${doc.documentUrl}`} target="_blank" rel="noreferrer" className="btn-view-doc">
                        <ExternalLink size={16} /> Open Document
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-docs">No documents attached.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;