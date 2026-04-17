import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  resolveGrievance,
  rejectGrievance,
} from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/GrievanceDetails.css";

const GrievanceDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
  const grievance = location.state;

  const [remarks, setRemarks] = useState("");

 
  if (!grievance) {
    return (
      <div style={{ padding: "20px" }}>
        No grievance data available.
      </div>
    );
  }

  //  Officer Resolve
  const handleResolve = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }

    try {
      await resolveGrievance(grievance.grievanceId, remarks);
      alert("Grievance resolved successfully");
      navigate("/grievances/assigned");
    } catch (error) {
      alert("Error while resolving grievance");
    }
  };

  //  Officer Reject
  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }

    

    try {
      await rejectGrievance(grievance.grievanceId, remarks);
      alert("Grievance rejected successfully");
      navigate("/grievances/assigned");
    } catch (error) {
      alert("Error while rejecting grievance");
    }
  };

  
  const handleViewCaseDetails = () => {
  if (!grievance || !grievance.applicationID) {
    alert("Application ID not found");
    return;
  }

  navigate(`/grievances/case/${grievance.applicationID}`);
};




  return (
  <div className="grievance-page-wrapper">
    <div className="grievance-card">

      <h2 className="grievance-card-title">
        Grievance Details
      </h2>

      {/*  Details section */}
      <div className="grievance-info">
        <p><b>Grievance ID:</b> {grievance.grievanceId}</p>
        <p><b>User ID:</b> {grievance.userId}</p>
        <p><b>Application ID:</b> {grievance.applicationID}</p>
        <p><b>Status:</b> {grievance.status}</p>
        <p><b>Reason:</b> {grievance.reason}</p>
        <p><b>Description:</b> {grievance.description}</p>
        <p>
          <b>Filed Date:</b>{" "}
          {grievance.filedDate
            ? new Date(grievance.filedDate).toLocaleDateString()
            : "-"}
        </p>
      </div>
      {/*  Remarks */}
      <div className="remarks-section">
        <label>Officer Remarks</label>
        <textarea
          placeholder="Enter remarks here..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <button type="button" className="view-case-btn" onClick={handleViewCaseDetails}>
        View Case</button>
     

      
    {/*  Action buttons */}
      <div className="action-buttons">
        <button className="resolve-btn" onClick={handleResolve}>
          Resolve
        </button>
        <button className="reject-btn" onClick={handleReject}>
          Reject
        </button>
      </div>

      {/*  Back */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

    </div>
  </div>
);

};

export default GrievanceDetails;