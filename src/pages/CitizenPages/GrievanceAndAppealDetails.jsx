import React from "react";
import "../../styles/CitizenStyles/pages/Grievance.css";

function GrievanceAndAppealDetails({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Details</h2>
        </div>
        <div className="modal-body">

         
          <p><strong>Application ID:</strong> {item.applicationID}</p>
          <p><strong>Reason:</strong> {item.reason}</p>
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Submitted:</strong> {new Date(item.filedDate).toLocaleDateString()}</p>

         
          <p><strong>Remarks:</strong> {item.remarks ? item.remarks : "No remarks available"}</p>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default GrievanceAndAppealDetails;