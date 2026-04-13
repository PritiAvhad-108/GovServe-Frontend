import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, FolderOpen, Upload, MessageSquareWarning } from "lucide-react";
import "../../styles/CitizenStyles/pages/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const createRipple = (e) => {
    const card = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(card.clientWidth, card.clientHeight);
    const rect = card.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${e.clientY - rect.top - diameter / 2}px`;
    circle.classList.add("ripple");

    const ripple = card.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();
    card.appendChild(circle);
  };

  return (
    <div className="content-wrapper">
      <h1>Welcome Back!</h1>
      <div className="cards">
     
        <div className="card green" onClick={(e) => { createRipple(e); navigate("/citizen/apply"); }}>
          <FileText size={60} className="icon" />
          <h3>Apply Services</h3>
          <div className="card-footer">
            <hr className="footer-line" /><p className="desc">Apply for services</p>
          </div>
        </div>

        <div className="card blue" onClick={(e) => { createRipple(e); navigate("/citizen/my-applications"); }}>
          <FolderOpen size={60} className="icon" />
          <h3>My Applications</h3>
          <div className="card-footer">
            <hr className="footer-line" /><p className="desc">Track status</p>
          </div>
        </div>

        <div className="card orange" onClick={(e) => { createRipple(e); navigate("/citizen/my-documents"); }}>
          <Upload size={60} className="icon" />
          <h3>Documents</h3>
          <div className="card-footer">
            <hr className="footer-line" /><p className="desc">Manage files</p>
          </div>
        </div>

        <div className="card red" onClick={(e) => { createRipple(e); navigate("/citizen/grievance"); }}>
          <MessageSquareWarning size={60} className="icon" />
          <h3>Grievance</h3>
          <div className="card-footer">
            <hr className="footer-line" /><p className="desc">Raise complaints</p>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default Dashboard;