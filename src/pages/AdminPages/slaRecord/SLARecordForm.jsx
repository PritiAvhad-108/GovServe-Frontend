import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SLARecordForm({ onClose, onSave, caseId }) {
  const [cases, setCases] = useState([]);
  const [stages, setStages] = useState([]);

  // ✅ Prefill caseId if provided
  const [form, setForm] = useState({
    caseId: caseId || "",
    stageId: "",
    startDate: ""
  });

  useEffect(() => {
    loadCases();
    loadStages();
  }, []);

  const loadCases = async () => {
    try {
      const res = await api.get("/Case/all");
      setCases(res.data);
    } catch {
      toast.error("Failed to load cases");
    }
  };

  const loadStages = async () => {
    try {
      const res = await api.get("/WorkflowStages");
      setStages(res.data);
    } catch {
      toast.error("Failed to load workflow stages");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.caseId || !form.stageId || !form.startDate) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      caseId: Number(form.caseId),
      stageId: Number(form.stageId),
      startDate: form.startDate
    };

    try {
      await api.post("/SLARecords", payload);
      toast.success("SLA record created successfully");
      onSave();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data || "Failed to create SLA record");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>Add SLA Record</h4>

        <form onSubmit={handleSubmit}>
          {/* ✅ CASE SELECT */}
          <label>Case</label>
          <select
            className="form-control mb-2"
            value={form.caseId}
            onChange={(e) =>
              setForm({ ...form, caseId: e.target.value })
            }
            disabled={!!caseId}  /* ✅ lock if prefilled */
          >
            <option value="">Select Case</option>
            {cases.map((c) => (
              <option key={c.caseId} value={c.caseId}>
                Case #{c.caseId} (App {c.applicationID})
              </option>
            ))}
          </select>

          {/* ✅ WORKFLOW STAGE */}
          <label>Workflow Stage</label>
          <select
            className="form-control mb-2"
            value={form.stageId}
            onChange={(e) =>
              setForm({ ...form, stageId: e.target.value })
            }
          >
            <option value="">Select Stage</option>
            {stages.map((s) => (
              <option key={s.stageID} value={s.stageID}>
                {s.responsibleRole} (Stage {s.stageID})
              </option>
            ))}
          </select>

          {/* ✅ START DATE */}
          <label>Start Date</label>
          <input
            type="date"
            className="form-control mb-3"
            value={form.startDate}
            onChange={(e) =>
              setForm({ ...form, startDate: e.target.value })
            }
          />

          {/* ✅ ACTIONS */}
          <div className="actions-row">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onClose}
            >
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