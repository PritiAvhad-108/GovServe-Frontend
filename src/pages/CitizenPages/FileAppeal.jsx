import { useState } from "react";
import Swal from "sweetalert2"; 
import { FileText, ClipboardList, AlignLeft } from "lucide-react"; 
import "../../styles/CitizenStyles/pages/FileAppeal.css";

function FileAppeal({ onClose }) {
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

    const payload = { ...formData, userId: userId };

    try {
      const res = await fetch("https://localhost:7027/api/Appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        
        Swal.fire({
          title: "Success!",
          text: "Your appeal has been submitted successfully.",
          icon: "success",
          confirmButtonColor: "#1e3a8a", 
          timer: 3000 
        });

        onClose(); 
      } else {
      
        Swal.fire({
          title: "Error!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33"
        });
      }
    } catch (err) {
      console.error("Error:", err);
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
          <h2>File Appeal</h2>
        </div>

        <form onSubmit={handleSubmit} className="appeal-form">
          {/* Application ID */}
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

          {/* Reason */}
          <label>
            <div className="field-label">
              <ClipboardList size={18} /> Reason
            </div>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter appeal reason"
              required
            />
          </label>

          {/* Description */}
          <label>
            <div className="field-label">
              <AlignLeft size={18} /> Description
            </div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your appeal in detail"
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

export default FileAppeal;