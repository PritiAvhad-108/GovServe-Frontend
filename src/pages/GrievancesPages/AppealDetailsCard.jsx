import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  approveAppeal,
  rejectAppeal,
} from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/GrievanceDetailsCard.css";

const AppealDetailsCard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Officer side: appeal object list मधून येतो
  const appeal = location.state;

  const [remarks, setRemarks] = useState("");

  // ✅ Safety check
  if (!appeal) {
    return <p className="loading">No appeal data available</p>;
  }

  // ✅ Officer Approve
  const handleApprove = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }

    await approveAppeal(appeal.appealID, remarks);
    alert("Appeal approved successfully");
    navigate("/grievances/appeals");
  };

  // ✅ Officer Reject
  const handleReject = async () => {
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }

    await rejectAppeal(appeal.appealID, remarks);
    alert("Appeal rejected successfully");
    navigate("/grievances/appeals");
  };

  return (
    <div className="card-container">
      <div className="grievance-card">
        <h2>Appeal Details</h2>

        <p><b>Appeal ID:</b> {appeal.appealID}</p>
        <p><b>Application ID:</b> {appeal.applicationID}</p>
        <p><b>Citizen ID:</b> {appeal.userId}</p>
        <p><b>Status:</b> {appeal.status}</p>

        <p><b>Reason:</b> {appeal.reason}</p>
        <p><b>Description:</b> {appeal.description}</p>

        <p>
          <b>Filed Date:</b>{" "}
          {appeal.filedDate
            ? new Date(appeal.filedDate).toLocaleDateString()
            : "-"}
        </p>

        <textarea
          placeholder="Enter officer remarks"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          disabled={appeal.status !== "Submitted"}
        />

        <div className="action-buttons">
          <button
            className="resolve-btn"
            onClick={handleApprove}
            disabled={appeal.status !== "Submitted"}
          >
            Approve
          </button>

          <button
            className="reject-btn"
            onClick={handleReject}
            disabled={appeal.status !== "Submitted"}
          >
            Reject
          </button>
        </div>

        <button
          className="back-btn"
          onClick={() => navigate("/grievances/appeals")}
        >
          ← Back to Appeals
        </button>
      </div>
    </div>
  );
};

export default AppealDetailsCard;
