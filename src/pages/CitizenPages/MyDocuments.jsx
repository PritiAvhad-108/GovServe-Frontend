import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FileText, ExternalLink, Loader2, 
  ShieldCheck, Calendar 
} from "lucide-react";

import "../../styles/CitizenStyles/pages/MyDocuments.css";

const MyDocuments = () => {
  const [groupedDocs, setGroupedDocs] = useState({});
  const [loading, setLoading] = useState(true);

  
  const userId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchAndGroupDocs = async () => {
    
      if (!userId || userId === "undefined" || !token || token === "undefined") {
        console.warn("MyDocuments: Missing or invalid userId/token");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Authorization Header 
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const res = await axios.get(
          `https://localhost:7027/api/CitizenDocument/GetMyAllDocuments/${userId}`, 
          config
        );
        
        // Grouping logic based on ApplicationID
        if (res.data && Array.isArray(res.data)) {
            const groups = res.data.reduce((acc, doc) => {
              const key = doc.applicationID;
              if (!acc[key]) acc[key] = [];
              acc[key].push(doc);
              return acc;
            }, {});
            setGroupedDocs(groups);
        } else {
            setGroupedDocs({});
        }

      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndGroupDocs();
  }, [userId, token]);

  return (
    <div className="app-layout">
      <div className="app-body">
        <main className="main-content">
          <div className="docs-compact-wrapper">
            
            <header className="compact-header">
              <div className="header-brand">
                <ShieldCheck size={22} className="brand-icon" />
                <h1>My Document Vault</h1>
              </div>
              <p>View and manage all uploaded application files.</p>
            </header>

            {loading ? (
              <div className="loader-box">
                <Loader2 className="spin" size={32} />
              </div>
            ) : Object.keys(groupedDocs).length > 0 ? (
              Object.entries(groupedDocs).map(([appId, docs]) => (
                <div key={appId} className="static-app-section">
                  
                  <div className="static-app-header">
                    <div className="header-left-info">
                      <span className="app-label">Application ID:</span>
                      <span className="app-id-val">#{appId}</span>
                      <span className="file-count">({docs.length} Documents)</span>
                    </div>
                  </div>

                  <div className="static-content-list">
                    {docs.map((doc, index) => (
                      <div key={index} className="compact-doc-row">
                        <div className="doc-main">
                          <FileText size={16} className="doc-icon" />
                          <div className="doc-details">
                            <p className="doc-name">{doc.documentName}</p>
                            <span className="doc-date">
                              <Calendar size={10} /> 
                              {new Date(doc.uploadedDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="doc-actions">
                          <span className={`status-pill ${doc.verificationStatus?.toLowerCase() || 'pending'}`}>
                            {doc.verificationStatus}
                          </span>
                          {/* ✅ फाईल URL जर बरोबर असेल तरच व्ह्यू बटन चालेल */}
                          <a 
                            href={`https://localhost:7027/${doc.documentUrl}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="mini-view-btn"
                          >
                            <ExternalLink size={14} /> View
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">No documents found.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyDocuments;