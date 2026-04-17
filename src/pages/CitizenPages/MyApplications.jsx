import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { 
  Search, Eye, Clock, Building2, Heart, GraduationCap, 
  Landmark, Briefcase, ShieldCheck, Edit3, Loader2 
} from "lucide-react";
import "../../styles/CitizenStyles/pages/MyApplications.css";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  
  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("jwtToken");

  const fetchApplications = async () => {
   
    if (!currentUserId || currentUserId === "undefined" || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.get(
        `https://localhost:7027/api/Application/my?userId=${currentUserId}`, 
        config
      );
      
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching apps:", err);

      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
 
    if (!token || token === "undefined") {
      navigate("/login");
    } else {
      fetchApplications();
    }
    
  }, [currentUserId, token]);

  const getServiceIcon = (deptName) => {
    const dept = deptName?.toLowerCase() || "";
    if (dept.includes("health")) return <Heart size={24} className="icon-blue" />;
    if (dept.includes("education")) return <GraduationCap size={24} className="icon-blue" />;
    if (dept.includes("revenue") || dept.includes("finance")) return <Landmark size={24} className="icon-blue" />;
    if (dept.includes("labor") || dept.includes("employment")) return <Briefcase size={24} className="icon-blue" />;
    if (dept.includes("police") || dept.includes("home")) return <ShieldCheck size={24} className="icon-blue" />;
    return <Building2 size={24} className="icon-blue" />;
  };

  const filteredApps = applications.filter(app =>
    app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="content-wrapper">
      
      
      <div className="search-section">
        <div className="search-box-attractive">
          <Search size={20} className="search-icon-color" />
          <input
            type="text"
            placeholder="Search your applications by service name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="status-msg"><Loader2 className="spin" /> Loading your applications...</div>
      ) : (
        <div className="service-list-vertical">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div 
                className={`service-row-card ${app.applicationStatus?.toLowerCase() === 'rejected' ? 'border-rejected' : ''}`} 
                key={app.applicationId}
              >
                <div className="card-left-content" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div className="icon-box-light">
                    {getServiceIcon(app.departmentName || "")} 
                  </div>
                  
                  <div className="service-text-details">
                    <h3 className="service-name-left">{app.serviceName}</h3>
                    <p className="service-desc-left">Application ID: {app.applicationId}</p>
                    
                    <div className="service-meta-container">
                      <div className="service-meta-left">
                          <Clock size={14} />
                          <span>{new Date(app.submittedDate).toLocaleDateString()}</span>
                      </div>
                      
                      <span className="meta-separator">•</span>

                      <div className={`status-tag-inline ${app.applicationStatus?.toLowerCase()}`}>
                          {app.applicationStatus}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="card-right-action">
                  {app.applicationStatus?.toLowerCase() === "rejected" ? (
                    <button 
                      className="edit-action-btn"
                      onClick={() => navigate(`/citizen/edit-application/${app.applicationId}`)}
                    >
                      <Edit3 size={18} />
                      <span>Edit & Resubmit</span>
                    </button>
                  ) : (
                    <div className="view-details-action" onClick={() => navigate(`/citizen/application-details/${app.applicationId}`)}>
                        <Eye size={20} />
                        <span>View Details</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="status-msg">No applications found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyApplications;