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
      // ✅ Load Service
      const serviceRes = await api.get(`/Services/${serviceId}`);
      const serviceData = serviceRes.data;
      setService(serviceData);

      const serviceName = serviceData.serviceName;

      // ✅ Load Eligibility Rules (handle empty state safely)
      try {
        const rulesRes = await api.get(
          `/EligibilityRules/search?serviceName=${encodeURIComponent(serviceName)}`
        );
        setRules(rulesRes.data);
        setRulesMessage("");
      } catch (err) {
        setRules([]);
        setRulesMessage("No eligibility rules defined for this service.");
      }

      // ✅ Load Required Documents (handle empty state safely)
      try {
        const docsRes = await api.get(
          `/RequiredDocuments/search?serviceName=${encodeURIComponent(serviceName)}`
        );
        setDocuments(docsRes.data);
        setDocsMessage("No required documents defined for this service.");
      } catch (err) {
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
    return <div style={{ padding: "20px" }}>Loading service details...</div>;
  }

  if (!service) {
    return <div style={{ padding: "20px" }}>Service not found</div>;
  }

  return (
    <div className="service-details-container">
      {/* ✅ Header */}
      <div className="details-header">
        <ArrowLeft className="back-icon" onClick={() => navigate(-1)} />
        <h2>{service.serviceName}</h2>
      </div>

      {/* ✅ Tabs */}
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

      {/* ✅ Eligibility Rules Tab */}
      {activeTab === "rules" && (
        <div className="content">
          {rules.length === 0 ? (
            <p className="empty-message">{rulesMessage}</p>
          ) : (
            rules.map((r) => (
              <div key={r.ruleID} className="rule-card">
                <div className="rule-desc">{r.ruleDescription}</div>
                <pre className="rule-expr">{r.ruleExpression}</pre>
              </div>
            ))
          )}
        </div>
      )}

      {/* ✅ Required Documents Tab */}
      {activeTab === "docs" && (
        <div className="content">
          {documents.length === 0 ? (
            <p className="empty-message">{docsMessage}</p>
          ) : (
            documents.map((d) => (
              <div key={d.documentID} className="doc-card">
                <span>{d.documentName}</span>

                {/* ✅ Yes → Mandatory | No → Optional */}
                <span
                  className={
                    d.mandatory === "Yes" ? "mandatory" : "optional"
                  }
                >
                  {d.mandatory === "Yes"
                    ? "Mandatory"
                    : "Optional"}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
