import React, { useEffect, useState } from "react";
import "./CaseDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const CaseDetails = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    fetchDetails();
  }, [caseId]);

  const fetchDetails = async () => {
    const res = await axios.get("https://localhost:7027/api/Case/all");
    const match = res.data.find(c => c.caseId == caseId);
    setCaseData(match);
  };

  if (!caseData) return <p>Loading...</p>;

  return (
    <div className="case-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back to Cases
      </button>

      <div className="details-card">
        <h2>Case Details</h2>

        <div className="details-grid">
          <p><b>Case ID</b><br />CASE-{caseData.caseId}</p>
          <p><b>Application</b><br />{caseData.applicationNumber}</p>
          <p><b>Service</b><br />{caseData.serviceName}</p>
          <p><b>Department</b><br />{caseData.departmentName}</p>
          <p><b>Department Id</b><br /> {caseData.departmentID}</p>        
          <p><b>Officer</b><br />{caseData.officerName}</p>
          <p><b>Officer Dept</b><br />{caseData.officerDepartment}</p>
          <p><b>Status</b><br />{caseData.status}</p>
          <p><b>Last Updated</b><br />{caseData.lastUpdated}</p>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;