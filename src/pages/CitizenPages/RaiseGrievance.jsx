import { useState } from "react";
import { FileText, ClipboardList, AlignLeft } from "lucide-react"; // User icon removed as field is gone
import "../../styles/CitizenStyles/pages/RaiseGrievance.css";

function RaiseGrievance({ onClose }) {
  
  const [formData, setFormData] = useState({
    applicationID: "",
    reason: "",
    description: ""
  });

  const userId = 1;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

 
    const payload = {
      ...formData,
      userId: userId // hardcoded 1 
    };

    try {
      const res = await fetch("https://localhost:7027/api/Grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), // payload 
      });

      if (res.ok) {
        alert("Grievance submitted successfully!");
        console.log("Grievance submitted:", await res.json());
        onClose(); 
      } else {
        alert("Failed to submit grievance");
        console.error("Failed to submit grievance");
      }
    } catch (err) {
      console.error("Error occurred while submitting grievance:", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Raise Grievance</h2>
        </div>

        <form onSubmit={handleSubmit} className="grievance-form">
          {/* Application ID Field */}
          <label>
            <div className="field-label">
              <FileText size={18} /> Application ID
            </div>
            <input
              type="text"
              name="applicationID"
              value={formData.applicationID}
              onChange={handleChange}
              placeholder="Enter your application ID"
              required
            />
          </label>
          {/* Reason Field */}
          <label>
            <div className="field-label">
              <ClipboardList size={18} /> Reason
            </div>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter grievance reason"
              required
            />
          </label>

          {/* Description Field */}
          <label>
            <div className="field-label">
              <AlignLeft size={18} /> Description
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your grievance in detail"
              required
            />
          </label>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Submit</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RaiseGrievance;