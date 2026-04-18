import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  ClipboardList,
  Upload,
  CheckCircle,
  Loader2,
  XCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";
import axios from "axios";
import "../../styles/CitizenStyles/pages/ApplicationForm.css";

const ApplicationForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedAppId, setGeneratedAppId] = useState("");

  const [serviceData, setServiceData] = useState(null);
  const [requiredDocs, setRequiredDocs] = useState([]);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

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

  const mandatoryFields = [
    "fullName",
    "fatherName",
    "motherName",
    "gender",
    "dateOfBirth",
    "aadhaarNumber",
    "phone",
    "email",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "pincode"
  ];

  /* validation */
  const validateStep2 = () => {
    const newErrors = {};
    mandatoryFields.forEach(f => {
      if (!citizen[f] || citizen[f].trim() === "") {
        newErrors[f] = true;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* fetch service + docs */
  useEffect(() => {
    if (!currentUserId || !token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [svc, docs] = await Promise.all([
          axios.get(`https://localhost:7027/api/Services/${id}`, config),
          axios.get(`https://localhost:7027/api/CitizenDocument/required-documents/${id}`, config)
        ]);

        setServiceData(svc.data);
        setRequiredDocs(docs.data);
      } catch {
        setApiError("Connection Error: Could not load service data.");
      }
    };

    fetchData();
  }, [id, token, currentUserId, navigate]);

  /* submit */
  const handleSubmit = async () => {
    setSubmitting(true);
    setApiError(null);

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };

      /* create application */
      const appRes = await axios.post(
        "https://localhost:7027/api/Application/create",
        {
          userId: parseInt(currentUserId),
          serviceID: parseInt(id),
          departmentID: parseInt(serviceData.departmentID)
        },
        config
      );

      const newAppId = appRes.data.applicationID;
      setGeneratedAppId(newAppId);

      /* citizen details */
      await axios.post(
        "https://localhost:7027/api/CitizenDetails/create",
        {
          ...citizen,
          applicationID: newAppId,
          dateOfBirth: new Date(citizen.dateOfBirth).toISOString()
        },
        config
      );

      /* upload docs */
      if (Object.keys(files).length > 0) {
        const uploads = Object.entries(files).map(([docId, file]) => {
          const formData = new FormData();
          formData.append("ApplicationID", newAppId);
          formData.append("UserId", currentUserId);
          formData.append("DocumentID", parseInt(docId));
          formData.append("URI", file);

          return axios.post(
            "https://localhost:7027/api/CitizenDocument/upload",
            formData,
            config
          );
        });

        await Promise.all(uploads);
      }

      setShowSuccess(true);
    } catch (err) {
      setApiError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="content-wrapper">
      <div className="stepper-container">
        <div className="stepper-header">
          <button className="round-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
          </button>
          <h2>Service Request Portal</h2>
        </div>

        <div className="step-bar">
          <div className={`dot ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`line ${step >= 2 ? "active" : ""}`} />
          <div className={`dot ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`line ${step >= 3 ? "active" : ""}`} />
          <div className={`dot ${step >= 3 ? "active" : ""}`}>3</div>
        </div>

        {apiError && (
          <div className="api-error-alert">
            <XCircle size={14} /> {apiError}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && serviceData && (
          <div className="step-card">
            <div className="card-title">
              <Building2 size={16} />
              <h3>Service Information</h3>
            </div>

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

            <div className="card-actions">
              <div />
              <button className="btn-primary" onClick={() => setStep(2)}>
                Continue <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
                           
        {step === 2 && (
          <div className="step-card fade-in">
            <div className="card-title"><User size={16}/> <h3>Citizen Personal Details</h3></div>
            <div className="compact-form">
              <div className="v-row">
                <div className="v-input-group">
                  <label>Full Name *</label>
                  <input value={citizen.fullName} onChange={e => setCitizen({...citizen, fullName: e.target.value})} placeholder="As per Aadhaar" />          
                  {errors.fullName && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>Father's Name *</label>
                  <input value={citizen.fatherName} onChange={e => setCitizen({...citizen, fatherName: e.target.value})} placeholder="Full name of Father" />
                  {errors.fatherName && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
              </div>
 
              <div className="v-row">
                <div className="v-input-group">
                  <label>Mother's Name *</label>
                  <input value={citizen.motherName} onChange={e => setCitizen({...citizen, motherName: e.target.value})} placeholder="Full name of Mother" />
                  {errors.motherName && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>Gender *</label>
                  <select value={citizen.gender} onChange={e => setCitizen({...citizen, gender: e.target.value})}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                    {errors.gender && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
              </div>
 
              <div className="v-row">
                <div className="v-input-group">
                  <label>Date of Birth *</label>
                  <input type="date" value={citizen.dateOfBirth} onChange={e => setCitizen({...citizen, dateOfBirth: e.target.value})} />
                   {errors.dateOfBirth && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>Aadhaar Number *</label>
                  <input maxLength="12" value={citizen.aadhaarNumber} onChange={e => setCitizen({...citizen, aadhaarNumber: e.target.value})} placeholder="12 Digit UIDAI No" />
                   {errors.aadhaarNumber && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
              </div>
 
              <div className="v-row">
                <div className="v-input-group">
                  <label>Phone Number *</label>
                  <input maxLength="10" value={citizen.phone} onChange={e => setCitizen({...citizen, phone: e.target.value})} placeholder="10 Digit Mobile" />
                   {errors.phone && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>Email Address *</label>
                  <input type="email" value={citizen.email} onChange={e => setCitizen({...citizen, email: e.target.value})} placeholder="example@mail.com" />
                   {errors.email && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
              </div>
 
              <div className="v-input-group full">
                <label>Address Line 1 *</label>
                <input value={citizen.addressLine1} onChange={e => setCitizen({...citizen, addressLine1: e.target.value})} placeholder="House No, Building, Area" />
                 {errors.addressLine1 && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
              </div>
              <div className="v-input-group full">
                <label>Address Line 2 *</label>
                <input value={citizen.addressLine2} onChange={e => setCitizen({...citizen, addressLine2: e.target.value})} placeholder="House No, Building, Area" />
                 {errors.addressLine2 && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
              </div>
              <div className="v-row">
                <div className="v-input-group">
                  <label>City / Village *</label>
                  <input value={citizen.city} onChange={e => setCitizen({...citizen, city: e.target.value})} placeholder="Enter City" />
                  {errors.city && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>State *</label>
                  <input value={citizen.state} onChange={e => setCitizen({...citizen, state: e.target.value})} placeholder="Enter State" />
                  {errors.state && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
                <div className="v-input-group">
                  <label>Pincode * </label>
                  <input maxLength="6" value={citizen.pincode} onChange={e => setCitizen({...citizen, pincode: e.target.value})} placeholder="6 Digits" />
                  {errors.pincode && <small style={{color:"red", fontSize: "11px"}}>Required</small>}
                </div>
              </div>
            </div>
 
            <div className="card-actions">
              <button className="btn-back" onClick={() => setStep(1)}>Back</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
              >
                Next: Upload Docs <ArrowRight size={14} />
              </button>

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
            <div className="success-check-circle">
              <CheckCircle color="white" size={32} />
            </div>
            <h3>Application Successful!</h3>
            <p>Your request has been submitted for verification.</p>
            <div className="app-id-badge">Application ID: {generatedAppId}</div>
            <button
              className="btn-modal-close"
              onClick={() => navigate("/citizen/my-applications")}
            >
              View Applications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;
 