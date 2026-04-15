import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {  
  User, Building2, ClipboardList, Upload, CheckCircle,  
  Loader2, XCircle, ArrowRight, ArrowLeft  
} from "lucide-react";
import axios from "axios";
import "../../styles/CitizenStyles/pages/ApplicationForm.css";

const ApplicationForm = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState("");
  
  const [serviceData, setServiceData] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [existingDocs, setExistingDocs] = useState([]);

  const currentUserId = localStorage.getItem("userId");  
  const token = localStorage.getItem("jwtToken");  

  const isEditMode = window.location.pathname.includes("edit-application");

  const [citizen, setCitizen] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    fatherName: "",
    motherName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    aadhaarNumber: ""
  });
  
  const [files, setFiles] = useState({});  

  useEffect(() => {
    if (!currentUserId || !token) {
        navigate("/login");
        return;
    }

    const fetchInitialData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        if (isEditMode && id) {
          const res = await axios.get(`https://localhost:7027/api/Application/${id}`, config);
          const data = res.data;
          
          console.log("Full Application Data:", data);

          const details = data.citizenInfo || data.citizenDetails || {};
          setCitizen({
            fullName: details.fullName || "",
            gender: details.gender || "",
            dateOfBirth: details.dateOfBirth?.split('T')[0] || "",
            fatherName: details.fatherName || "",
            motherName: details.motherName || "",
            email: details.email || "",
            phone: details.phone || "",
            addressLine1: details.addressLine1 || "",
            addressLine2: details.addressLine2 || "",
            city: details.city || "",
            state: details.state || "",
            pincode: details.pincode || "",
            aadhaarNumber: details.aadhaarNumber || ""
          });

          setExistingDocs(data.documents || []);

          const svcId = data.serviceID || data.serviceId || (data.service && data.service.serviceID);
          if (svcId) {
            const [svc, docs] = await Promise.all([
              axios.get(`https://localhost:7027/api/Services/${svcId}`, config),
              axios.get(`https://localhost:7027/api/CitizenDocument/required-documents/${svcId}`, config)
            ]);
            setServiceData(svc.data);
            setRequiredDocs(docs.data);
            console.log("Required Docs:", docs.data);
          } else {
            setServiceData({
              serviceName: data.serviceName || "N/A",  
              departmentName: data.departmentName || "N/A"
            });
          }
        } else {
          const [svc, docs] = await Promise.all([
            axios.get(`https://localhost:7027/api/Services/${id}`, config),
            axios.get(`https://localhost:7027/api/CitizenDocument/required-documents/${id}`, config)
          ]);
          setServiceData(svc.data);
          setRequiredDocs(docs.data);
          console.log("Required Docs:", docs.data);
        }
      } catch (err) {
        setApiError("Connection Error: Could not load data.");
      }
    };
    fetchInitialData();
  }, [id, currentUserId, token, navigate, isEditMode]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (isEditMode) {
        let uploadedDocs = [];
        if (Object.keys(files).length > 0) {
          const uploadPromises = Object.entries(files).map(async ([docId, file]) => {
            const formData = new FormData();
            formData.append("ApplicationID", id);
            formData.append("UserId", currentUserId);
            formData.append("DocumentID", parseInt(docId));  
            formData.append("URI", file);  
            const upRes = await axios.post("https://localhost:7027/api/CitizenDocument/upload", formData, {
              headers: { ...config.headers, 'Content-Type': 'multipart/form-data' }
            });
            
            return {
              documentName: requiredDocs.find(d => (d.documentID || d.documentId) === parseInt(docId))?.documentName || "",
              documentUrl: upRes.data.url || file.name
            };
          });
          uploadedDocs = await Promise.all(uploadPromises);
        }

        const formattedDocs = uploadedDocs.map(doc => ({
          documentName: doc.documentName,
          documentUrl: doc.documentUrl,
          verificationStatus: "Pending",
          uploadedDate: new Date().toISOString()
        }));

        const allDocs = [
          ...(existingDocs || []),
          ...formattedDocs
        ];

        const updatePayload = {
          applicationID: parseInt(id),
          applicationStatus: "Resubmitted",
          submittedDate: new Date().toISOString(),
          citizenInfo: {  
            ...citizen,
            applicationID: parseInt(id),
            dateOfBirth: citizen.dateOfBirth ? new Date(citizen.dateOfBirth).toISOString() : null
          },
          documents: allDocs
        };

        await axios.put(`https://localhost:7027/api/Application/resubmit/${id}`, updatePayload, config);
        
        setGeneratedAppId(id);
        setShowSuccess(true);
      } else {
        const deptId = serviceData?.departmentID || 0;
        const appRes = await axios.post("https://localhost:7027/api/Application/create", {
          userId: parseInt(currentUserId),
          serviceID: parseInt(id),
          departmentID: parseInt(deptId)
        }, config);

        const newAppId = appRes.data.applicationID || appRes.data.applicationId;
        setGeneratedAppId(newAppId);

        await axios.post("https://localhost:7027/api/CitizenDetails/create", {  
          ...citizen,  
          applicationID: newAppId,
          dateOfBirth: new Date(citizen.dateOfBirth).toISOString()
        }, config);

        if (Object.keys(files).length > 0) {
          const uploadPromises = Object.entries(files).map(([docId, file]) => {
            const formData = new FormData();
            formData.append("ApplicationID", newAppId);
            formData.append("UserId", currentUserId);
            formData.append("DocumentID", parseInt(docId));  
            formData.append("URI", file);  
            return axios.post("https://localhost:7027/api/CitizenDocument/upload", formData, config);
          });
          await Promise.all(uploadPromises);
        }
        setShowSuccess(true);
      }
    } catch (err) {
      setApiError(err.response?.data?.message || "Submission failed. Please check backend logs.");
    } finally {
      setSubmitting(false);
    }
  };

 
  return (
    <div className="content-wrapper">
      <div className="stepper-container">
        <div className="stepper-header">
          <button className="round-back" onClick={() => navigate(-1)}><ArrowLeft size={16}/></button>
          <h2>{isEditMode ? "Update Service Request" : "Service Request Portal"}</h2>
        </div>

        <div className="step-bar">
          <div className={`dot ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`line ${step >= 2 ? "active" : ""}`}></div>
          <div className={`dot ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`line ${step >= 3 ? "active" : ""}`}></div>
          <div className={`dot ${step >= 3 ? "active" : ""}`}>3</div>
        </div>

        {apiError && <div className="api-error-alert fade-in"><XCircle size={14}/> {apiError}</div>}

        {step === 1 && serviceData && (
          <div className="step-card fade-in">
            <div className="card-title"><Building2 size={16}/> <h3>Service Information</h3></div>
            <div className="compact-form">
              <div className="v-row">
                <div className="v-input-group">
                  <label>Service Type</label>
                  <div className="v-readonly-box">{serviceData.serviceName}</div>
                </div>
                <div className="v-input-group">
                  <label>Issuing Department</label>
                  <div className="v-readonly-box">{serviceData.departmentName}</div>
                </div>
              </div>
            </div>
            <div className="card-actions">
              <div/>
              <button className="btn-primary" onClick={() => setStep(2)}>Continue to Form <ArrowRight size={14}/></button>
            </div>
          </div>
        )}
                           
        {step === 2 && (
          <div className="step-card fade-in">
            <div className="card-title"><User size={16}/> <h3>Citizen Personal Details</h3></div>
            <div className="compact-form">
              <div className="v-row">
                <div className="v-input-group">
                  <label>Full Name</label>
                  <input value={citizen.fullName} onChange={e => setCitizen({...citizen, fullName: e.target.value})} placeholder="As per Aadhaar" />
                </div>
                <div className="v-input-group">
                  <label>Father's Name</label>
                  <input value={citizen.fatherName} onChange={e => setCitizen({...citizen, fatherName: e.target.value})} placeholder="Full name of Father" />
                </div>
              </div>

              <div className="v-row">
                <div className="v-input-group">
                  <label>Mother's Name</label>
                  <input value={citizen.motherName} onChange={e => setCitizen({...citizen, motherName: e.target.value})} placeholder="Full name of Mother" />
                </div>
                <div className="v-input-group">
                  <label>Gender</label>
                  <select value={citizen.gender} onChange={e => setCitizen({...citizen, gender: e.target.value})}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="v-row">
                <div className="v-input-group">
                  <label>Date of Birth</label>
                  <input type="date" value={citizen.dateOfBirth} onChange={e => setCitizen({...citizen, dateOfBirth: e.target.value})} />
                </div>
                <div className="v-input-group">
                  <label>Aadhaar Number</label>
                  <input maxLength="12" value={citizen.aadhaarNumber} onChange={e => setCitizen({...citizen, aadhaarNumber: e.target.value})} placeholder="12 Digit UIDAI No" />
                </div>
              </div>

              <div className="v-row">
                <div className="v-input-group">
                  <label>Phone Number</label>
                  <input maxLength="10" value={citizen.phone} onChange={e => setCitizen({...citizen, phone: e.target.value})} placeholder="10 Digit Mobile" />
                </div>
                <div className="v-input-group">
                  <label>Email Address</label>
                  <input type="email" value={citizen.email} onChange={e => setCitizen({...citizen, email: e.target.value})} placeholder="example@mail.com" />
                </div>
              </div>

              <div className="v-input-group full">
                <label>Address Line 1</label>
                <input value={citizen.addressLine1} onChange={e => setCitizen({...citizen, addressLine1: e.target.value})} placeholder="House No, Building, Area" />
              </div>
              <div className="v-input-group full">
                <label>Address Line 2</label>
                <input value={citizen.addressLine2} onChange={e => setCitizen({...citizen, addressLine2: e.target.value})} placeholder="House No, Building, Area" />
              </div>
              <div className="v-row">
                <div className="v-input-group">
                  <label>City / Village</label>
                  <input value={citizen.city} onChange={e => setCitizen({...citizen, city: e.target.value})} placeholder="Enter City" />
                </div>
                <div className="v-input-group">
                  <label>State</label>
                  <input value={citizen.state} onChange={e => setCitizen({...citizen, state: e.target.value})} placeholder="Enter State" />
                </div>
                <div className="v-input-group">
                  <label>Pincode</label>
                  <input maxLength="6" value={citizen.pincode} onChange={e => setCitizen({...citizen, pincode: e.target.value})} placeholder="6 Digits" />
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button className="btn-back" onClick={() => setStep(1)}>Back</button>
              <button className="btn-primary" onClick={() => setStep(3)}>Next: Upload Docs <ArrowRight size={14}/></button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-card fade-in">
            <div className="card-title"><ClipboardList size={16}/> <h3>Upload Proofs</h3></div>
            <div className="upload-list">
              {requiredDocs.map(doc => (
                <div key={doc.documentID} className="upload-item-box">
                  <div className="upload-text">
                    <span className="doc-label">{doc.documentName}</span>
                    {files[doc.documentID] && <span className="file-name">{files[doc.documentID].name}</span>}
                    {isEditMode && files[doc.documentID] && <span className="file-name status-pending">Existing document attached</span>}
                  </div>
                  <label className={`upload-btn-label ${files[doc.documentID] ? 'uploaded' : ''}`}>
                    {files[doc.documentID] ? <CheckCircle size={16}/> : <Upload size={16}/>}
                    <input type="file" hidden onChange={e => setFiles({...files, [doc.documentID]: e.target.files[0]})} />
                  </label>
                </div>
              ))}
            </div>
            <div className="card-actions">
              <button className="btn-back" onClick={() => setStep(2)}>Back</button>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? <Loader2 className="spin" size={16}/> : (isEditMode ? "Update & Resubmit" : "Final Submission")}
              </button>
            </div>
          </div>
        )}
      </div>

      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-card">
            <div className="success-icon-wrapper">
              <div className="success-check-circle"><CheckCircle color="white" size={32}/></div>
            </div>
            <h3>{isEditMode ? "Application Updated!" : "Application Successful!"}</h3>
            <p>Your request has been {isEditMode ? "resubmitted" : "submitted"} for verification.</p>
            <div className="app-id-badge">Application ID: {generatedAppId}</div>
            <button className="btn-modal-close" onClick={() => navigate("/citizen/my-applications")}>View Applications</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;