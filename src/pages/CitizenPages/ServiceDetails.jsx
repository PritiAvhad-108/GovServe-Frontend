import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import "../../styles/CitizenStyles/pages/ServiceDetails.css";

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState(null);
  const [eligibility, setEligibility] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("jwtToken"); 

        const headers = {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        };

        const [svcRes, rulesRes, docsRes] = await Promise.all([
          fetch(`https://localhost:7027/api/Services/${id}`, { headers }),
          fetch(`https://localhost:7027/api/EligibilityRules/service/${id}`, { headers }),
          fetch(`https://localhost:7027/api/RequiredDocuments/service/${id}`, { headers })
        ]);

        if (svcRes.ok) setServiceData(await svcRes.json());
        setEligibility(rulesRes.ok ? await rulesRes.json() : []);
        setDocuments(docsRes.ok ? await docsRes.json() : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="loader">Loading...</div>;

  return (
    <div className="details-wrapper">
      <div className="service-card-main">
        
        {/* Header Section */}
        <div className="card-header-blue">
          <button className="back-circle-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h2 className="header-text-center">Service Information</h2>
        </div>

        <div className="card-body-padding">
          <div className="service-intro-section">
            <h1 className="service-name-display">{serviceData?.serviceName}</h1>
            <p className="service-description-text">{serviceData?.description}</p>
            <div className="sla-badge">
              <Clock size={14} /> 
              <span>Approval Time - {serviceData?.slA_Days} Day </span>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="detail-info-card">
            <div className="section-header">
              <CheckCircle2 size={18} className="icon-primary" />
              <h3>Eligibility Criteria</h3>
            </div>
            <div className="items-list">
              {eligibility.length > 0 ? (
                eligibility.map((rule) => (
                  <div key={rule.ruleID} className="list-row">
                    <span className="dot-bullet"></span>
                    <p className="standard-text">{rule.ruleDescription}</p>
                  </div>
                ))
              ) : (<p className="empty-msg">No specific criteria listed.</p>)}
            </div>
          </div>

          {/* Required Documents */}
          <div className="detail-info-card">
            <div className="section-header">
              <FileText size={18} className="icon-primary" />
              <h3>Required Documents</h3>
            </div>
            <div className="items-list">
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <div key={doc.documentID} className="list-row">
                    <span className="index-badge">{index + 1}</span>
                    <p className="standard-text">
                      {doc.documentName} 
                      {doc.mandatory === "Yes" && <span className="red-star">*</span>}
                    </p>
                  </div>
                ))
              ) : (<p className="empty-msg">No documents required.</p>)}
            </div>
          </div>

          <div className="warning-note">
            <AlertCircle size={16} />
            <p>Please ensure you have all scanned documents ready before clicking apply.</p>
          </div>

          <button 
            className="primary-apply-button" 
            onClick={() => navigate(`/citizen/apply-form/${id}`)}
          >
            Apply for Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;