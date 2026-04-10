import { useState } from "react";
import Swal from "sweetalert2";
import { FileText, ClipboardList, AlignLeft } from "lucide-react"; 
import "../../styles/CitizenStyles/pages/RaiseGrievance.css";

function RaiseGrievance({ onClose }) {
  
  const [formData, setFormData] = useState({
    applicationID: "",
    reason: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const storedUserId = localStorage.getItem("userId");
    const token = localStorage.getItem("jwtToken");

    const payload = {
      ...formData,
      userId: storedUserId || 1 
    };

    try {
      const res = await fetch("https://localhost:7027/api/Grievance", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
     
        Swal.fire({
          title: "Success!",
          text: "Grievance submitted successfully!",
          icon: "success",
          confirmButtonColor: "#1e3a8a",
          timer: 3000
        });
        onClose(); 
      } else {
        const errorData = await res.text();
        console.error("Server Response:", errorData);
        
       
        Swal.fire({
          title: "Error!",
          text: "Failed to submit grievance. Status: " + res.status,
          icon: "error",
          confirmButtonColor: "#d33"
        });
      }
    } catch (err) {
      console.error("Error occurred while submitting grievance:", err);
    
      Swal.fire({
        title: "Server Error",
        text: "Could not connect to the server.",
        icon: "warning"
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Raise Grievance</h2>
        </div>

        <form onSubmit={handleSubmit} className="grievance-form">
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