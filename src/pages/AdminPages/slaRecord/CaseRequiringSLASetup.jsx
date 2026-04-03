import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./slaRecords.css";
import { Timer } from "lucide-react";

export default function CasesRequiringSLASetup() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    loadPendingCases();
  }, []);

  const loadPendingCases = async () => {
    const res = await api.get("/SLARecords/pending-cases");
    setCases(res.data);
  };

  return (
    <div className="sla-container">
      {/* HEADER */}
      <div className="sla-header">
        <div>
          <h2 className="page-title">Cases Requiring SLA Setup</h2>
          <p className="page-subtitle">
            Create SLA records for pending cases
          </p>
        </div>

        {/* ✅ Pending SLA Count Card */}
        <div className="sla-count-card">
          <div className="icon-bg">
            <Timer size={28} color="#2563eb" />
          </div>
          <div>
            <p>Pending SLA Cases</p>
            <h3>{cases.length}</h3>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-white">
        <thead>
          <tr>
            <th>Case ID</th>
            <th>Application</th>
            <th>Service</th>
            <th>Department</th>
            <th>Officer</th>
            <th>Status</th>
            <th>Last Updated</th>
          </tr>
        </thead>

        <tbody>
          {cases.map((c) => (
            <tr key={c.caseId}>
              <td>{c.caseId}</td>
              <td>{c.applicationNumber}</td>
              <td>{c.serviceName}</td>
              <td>{c.departmentName}</td>
              <td>{c.assignedOfficer}</td>
              <td>
                <span className="case-status assigned">
                  {c.status}
                </span>
              </td>
              <td>
                {new Date(c.lastUpdated).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}