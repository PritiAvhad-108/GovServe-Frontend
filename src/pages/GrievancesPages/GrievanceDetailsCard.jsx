import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GrievanceLayout from "../../components/GrievanceComponents/layout/GrievanceLayout";
import "../../styles/GrievanceStyles/GrievanceDetailsCard.css";

import {
  getGrievanceViewById,
  resolveGrievance,
  rejectGrievance
} from "../../api/GrievanceApi";

const GrievanceDetailsCard = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [grievance, setGrievance] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievance();
  }, []);

  const fetchGrievance = async () => {
    try {
      const response = await getGrievanceViewById(id);
      setGrievance(response.data);
    } catch (error) {
      alert("Unable to fetch grievance details");
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
  if (grievance.status !== "Submitted") {
    alert("Grievance already resolved or rejected");
    return;
  }
  if (!remarks.trim()) {
    alert("Please enter remarks");
    return;
  }
  try {
    await resolveGrievance(id, remarks);
    alert("Grievance resolved successfully");
    
    setGrievance(prev => ({
      ...prev,
      status: "Resolved",
      remarks: remarks
    }));
  } 
catch (error) {
  console.warn("Resolve blocked:", error);
}

};
 

  const handleReject = async () => {
  if (grievance.status !== "Submitted") {
    alert("Grievance already resolved or rejected");
    return;
  }

  if (!remarks.trim()) {
    alert("Please enter remarks");
    return;
  }

  try {
    await rejectGrievance(id, remarks);

    alert("Grievance rejected successfully");

  
    setGrievance(prev => ({
      ...prev,
      status: "Rejected",
      remarks: remarks
    }));

  } 
catch (error) {
  console.warn("Reject blocked:", error);
}

};


  if (loading) return <p className="loading">Loading...</p>;
  if (!grievance) return <p className="loading">No data found</p>;

  return (
    <GrievanceLayout>
      <div className="card-container">
        <div className="grievance-card">
          <h2>Grievance Details</h2>

          <p><b>Grievance ID:</b> {grievance.grievanceId}</p>
          <p><b>Application ID:</b> {grievance.applicationID}</p>
          <p><b>Citizen ID:</b> {grievance.citizenId}</p>
          <p><b>Status:</b> {grievance.status}</p>

          <p><b>Reason:</b> {grievance.reason}</p>
          <p><b>Description:</b> {grievance.description}</p>
          <p>
            <b>Filed Date:</b>{" "}
            {new Date(grievance.filedDate).toLocaleDateString()}
          </p>

         <div className="remarks-section">
  <div className="remarks-header">
    Officer Remarks
  </div>

  <div className="remarks-body">
    <label className="remarks-sub-label">
      Remarks / Resolution Note
    </label>

    <textarea
      placeholder="Enter official remarks or resolution notes here..."
      value={remarks}
      onChange={(e) => setRemarks(e.target.value)}
      disabled={grievance.status !== "Submitted"}
    />
  </div>

  <div className="remarks-footer">
    <button className="view-case-btn">
      View Case
    </button>
  </div>
</div>
          <div className="action-buttons">
            <button
              className="resolve-btn"
              onClick={handleResolve}
              disabled={grievance.status !== "Submitted"}
            >
              Resolve
            </button>

            <button
              className="reject-btn"
              onClick={handleReject}
              disabled={grievance.status !== "Submitted"}
            >
              Reject
            </button>
          </div>

          <button className="back-btn" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </GrievanceLayout>
  );
};

export default GrievanceDetailsCard;