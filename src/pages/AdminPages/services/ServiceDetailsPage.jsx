import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { ArrowLeft, ShieldCheck, FileText } from "lucide-react";
import "./serviceDetails.css";

export default function ServiceDetailsPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [rules, setRules] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [rulesMessage, setRulesMessage] = useState("");
  const [docsMessage, setDocsMessage] = useState("");

  const [activeTab, setActiveTab] = useState("rules");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServiceAndDetails();
  }, [serviceId]);

  const loadServiceAndDetails = async () => {
    setLoading(true);

    try {
      const serviceRes = await api.get(`/Services/${serviceId}`);
      const serviceData = serviceRes.data;
      setService(serviceData);

      const serviceName = serviceData.serviceName;

      /* Eligibility Rules */
      try {
        const rulesRes = await api.get(
          `/EligibilityRules/search?serviceName=${encodeURIComponent(
            serviceName
          )}`
        );
        setRules(rulesRes.data);
        setRulesMessage("");
      } catch {
        setRules([]);
        setRulesMessage("No eligibility rules defined for this service.");
      }

      /*  Required Documents */
      try {
        const docsRes = await api.get(
          `/RequiredDocuments/search?serviceName=${encodeURIComponent(
            serviceName
          )}`
        );
        setDocuments(docsRes.data);
        setDocsMessage("");
      } catch {
        setDocuments([]);
        setDocsMessage("No required documents defined for this service.");
      }
    } catch (err) {
      console.error("Failed to load service details", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "24px" }}>Loading service details...</div>;
  }

  if (!service) {
    return <div style={{ padding: "24px" }}>Service not found</div>;
  }

  return (
    <div className="service-details-container">
      {/*  HEADER */}
      <div className="details-header">
        <ArrowLeft
          className="back-icon"
          size={22}
          onClick={() => navigate(-1)}
        />
        <h2>{service.serviceName}</h2>
      </div>

      {/*  TABS */}
      <div className="tabs">
        <button
          className={activeTab === "rules" ? "active" : ""}
          onClick={() => setActiveTab("rules")}
        >
          <ShieldCheck size={16} /> Eligibility Rules
        </button>

        <button
          className={activeTab === "docs" ? "active" : ""}
          onClick={() => setActiveTab("docs")}
        >
          <FileText size={16} /> Required Documents
        </button>
      </div>

      {/*  ELIGIBILITY RULES */}
      {activeTab === "rules" && (
        <div className="content">
          {rules.length === 0 ? (
            <p className="empty-message">{rulesMessage}</p>
          ) : (
            rules.map(r => (
              <div key={r.ruleID} className="rule-card">
                <div className="rule-desc">{r.ruleDescription}</div>
              </div>
            ))
          )}
        </div>
      )}

      {/*  REQUIRED DOCUMENTS */}
      {activeTab === "docs" && (
        <div className="content">
          {documents.length === 0 ? (
            <p className="empty-message">{docsMessage}</p>
          ) : (
            documents.map(d => (
              <div key={d.documentID} className="doc-card">
                <span>{d.documentName}</span>
                <span
                  className={d.mandatory === "Yes" ? "mandatory" : "optional"}
                >
                  {d.mandatory === "Yes" ? "Mandatory" : "Optional"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}