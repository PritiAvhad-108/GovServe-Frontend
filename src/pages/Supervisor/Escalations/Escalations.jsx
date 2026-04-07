import React, { useEffect, useState } from "react";
import "./Escalations.css";
import API, { getOfficerStatistics } from "../../../api/api";

const Escalations = () => {
  const [form, setForm] = useState({
    caseId: "",
    newOfficerId: ""
  });

  const [escalatedCases, setEscalatedCases] = useState([]);
  const [allOfficers, setAllOfficers] = useState([]);
  const [filteredOfficers, setFilteredOfficers] = useState([]);

  const [currentOfficerName, setCurrentOfficerName] = useState(null);
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const caseRes = await API.get("/Case/all");
    const officerRes = await getOfficerStatistics();

    setEscalatedCases(caseRes.data.filter(c => c.status === "Escalated"));
    setAllOfficers(officerRes.data);
  };

  const handleCaseChange = (e) => {
    const caseId = Number(e.target.value);

    setForm({ caseId, newOfficerId: "" });
    setFilteredOfficers([]);
    setStatusMsg("");
    setErrorMsg("");

    if (!caseId) return;

    const selectedCase = escalatedCases.find(c => c.caseId === caseId);
    if (!selectedCase) {
      setErrorMsg("Selected case not found or not escalated.");
      return;
    }

    setCurrentOfficerName(selectedCase.officerName);

    const officersInDepartment = allOfficers.filter(
      o =>
        o.department === selectedCase.departmentName &&
        o.officerName !== selectedCase.officerName
    );

    if (officersInDepartment.length === 0) {
      setErrorMsg("No alternative officers available for this department.");
      return;
    }

    setFilteredOfficers(officersInDepartment);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg("");
    setErrorMsg("");

    try {
      const res = await API.post("/Case/reassign-escalated", null, {
        params: {
          caseId: form.caseId,
          newOfficerId: form.newOfficerId
        }
      });

      setStatusMsg(res.data || "Case reassigned successfully");

      // ✅ KEY FIX: remove reassigned case from UI
      setEscalatedCases(prev =>
        prev.filter(c => c.caseId !== form.caseId)
      );

      setForm({ caseId: "", newOfficerId: "" });
      setFilteredOfficers([]);
    } catch {
      setErrorMsg("Failed to reassign escalated case.");
    }
  };

  return (
    <div className="escalations-container">
      <h2 className="page-title">Escalations</h2>

      <div className="card">
        <h3>Reassign Escalated Case</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Case ID</label>
            <select value={form.caseId} onChange={handleCaseChange} required>
              <option value="">Select Escalated Case</option>
              {escalatedCases.map(c => (
                <option key={c.caseId} value={c.caseId}>
                  CASE-{c.caseId} ({c.serviceName})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>New Officer</label>
            <select
              value={form.newOfficerId}
              onChange={(e) =>
                setForm({ ...form, newOfficerId: Number(e.target.value) })
              }
              disabled={filteredOfficers.length === 0}
              required
            >
              <option value="">Select Officer</option>
              {filteredOfficers.map(o => (
                <option key={o.officerId} value={o.officerId}>
                  {o.officerName} | Load: {o.activeCases}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={!form.newOfficerId}>
            Reassign Case
          </button>
        </form>

        {statusMsg && <p className="success">{statusMsg}</p>}
        {errorMsg && <p className="error">{errorMsg}</p>}
      </div>

      <div className="card">
        <h3>Escalated Cases</h3>
        <table>
          <thead>
            <tr>
              <th>Case ID</th>
              <th>Service</th>
              <th>Officer</th>
            </tr>
          </thead>
          <tbody>
            {escalatedCases.map(c => (
              <tr key={c.caseId}>
                <td>CASE-{c.caseId}</td>
                <td>{c.serviceName}</td>
                <td>{c.officerName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Escalation Timeline</h3>
        <ul className="timeline">
          <li>Case Assigned</li>
          <li>SLA Breached</li>
          <li>Case Escalated</li>
          <li>Supervisor Reassignment</li>
        </ul>

        <h4>Reassignment Guidelines</h4>
        <ul>
          <li>Only escalated cases can be reassigned</li>
          <li>Department is auto-detected from case</li>
          <li>Current officer cannot be reassigned</li>
          <li>Prefer officers with lower workload</li>
          <li>Officer will be notified automatically</li>
        </ul>
      </div>
    </div>
  );
};

export default Escalations;