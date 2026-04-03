import React, { useState } from "react";
import api from "../../../api/api";
import "./serviceReports.css";
import {
  BarChart3,
  FileText,
  Clock,
  AlertTriangle
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import ReportFilterForm from "./ReportFilterForm";

export default function ServiceReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async (filters) => {
    setLoading(true);
    try {
      const res = await api.post("/ServiceReports/generate", filters);
      setReport(res.data);
      toast.success("Report generated successfully");
    } catch (err) {
      toast.error(err.response?.data || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="service-reports-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="reports-header">
        <div>
          <h2 className="page-title">Service Reports</h2>
          <p className="page-subtitle">
            Generate performance and SLA compliance reports
          </p>
        </div>
      </div>

      {/* FILTER FORM */}
      <ReportFilterForm onGenerate={generateReport} loading={loading} />

      {/* REPORT RESULT */}
      {report && (
        <>
          {/* META INFO */}
          <div className="report-meta">
            <p><strong>Scope:</strong> {report.scope}</p>
            <p>
              <strong>Generated On:</strong>{" "}
              {new Date(report.generatedDate).toLocaleString()}
            </p>
          </div>

          {/* METRICS */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="icon-bg">
                <FileText size={28} color="#2563eb" />
              </div>
              <div>
                <p>Applications</p>
                <h3>{report.metrics.applicationsCount}</h3>
              </div>
            </div>

            <div className="metric-card">
              <div className="icon-bg">
                <BarChart3 size={28} color="#16a34a" />
              </div>
              <div>
                <p>Approval Rate (%)</p>
                <h3>{report.metrics.approvalRate}</h3>
              </div>
            </div>

            <div className="metric-card">
              <div className="icon-bg">
                <Clock size={28} color="#f59e0b" />
              </div>
              <div>
                <p>Avg Turnaround (Days)</p>
                <h3>{report.metrics.avgTurnaroundDays}</h3>
              </div>
            </div>

            <div className="metric-card">
              <div className="icon-bg">
                <AlertTriangle size={28} color="#dc2626" />
              </div>
              <div>
                <p>SLA Breach Rate (%)</p>
                <h3>{report.metrics.slaBreachRate}</h3>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}