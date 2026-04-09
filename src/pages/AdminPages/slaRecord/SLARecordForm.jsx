import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SLARecordForm({ onClose, onSave, caseId }) {
  const [cases, setCases] = useState([]);
  const [stages, setStages] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    caseId: caseId || "",
    stageId: "",
    startDate: ""
  });

  useEffect(() => {
    api.get("/Case/all").then(res => setCases(res.data));
    api.get("/WorkflowStages").then(res => setStages(res.data));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.caseId) e.caseId = "Case is required.";
    if (!form.stageId) e.stageId = "Workflow stage is required.";
    if (!form.startDate) e.startDate = "Start date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await api.post("/SLARecords", {
        caseId: Number(form.caseId),
        stageId: Number(form.stageId),
        startDate: form.startDate
      });
      toast.success("SLA record created successfully");
      onSave();
    } catch {
      toast.error("Failed to create SLA record");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>Add SLA Record</h4>

        <form onSubmit={handleSubmit}>
          <label>Case</label>
          <select
            className={`form-control ${errors.caseId ? "is-invalid" : ""}`}
            value={form.caseId}
            disabled={!!caseId}
            onChange={e => setForm({ ...form, caseId: e.target.value })}
          >
            <option value="">Select Case</option>
            {cases.map(c => (
              <option key={c.caseId} value={c.caseId}>
                Case #{c.caseId}
              </option>
            ))}
          </select>
          {errors.caseId && <small className="error-text">{errors.caseId}</small>}

          <label>Workflow Stage</label>
          <select
            className={`form-control ${errors.stageId ? "is-invalid" : ""}`}
            value={form.stageId}
            onChange={e => setForm({ ...form, stageId: e.target.value })}
          >
            <option value="">Select Stage</option>
            {stages.map(s => (
              <option key={s.stageID} value={s.stageID}>
                {s.responsibleRole}
              </option>
            ))}
          </select>
          {errors.stageId && <small className="error-text">{errors.stageId}</small>}

          <label>Start Date</label>
          <input
            type="date"
            className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
          {errors.startDate && <small className="error-text">{errors.startDate}</small>}

          <div className="actions-row">
            <button className="btn btn-secondary" type="button" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}