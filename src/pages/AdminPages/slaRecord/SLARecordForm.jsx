import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SLARecordForm({ onClose, onSave, record }) {
  const isEditMode = !!record?.slaRecordID;

  const [cases, setCases] = useState([]);
  const [stages, setStages] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    caseId: record?.caseID || "",
    stageId: record?.stageID || "",
    startDate: record?.startDate
      ? record.startDate.split("T")[0]
      : ""
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const caseRes = await api.get("/Case/all");
        const stageRes = await api.get("/WorkflowStages");

        let availableCases = caseRes.data;

        // ✅ REMOVE CASES THAT ALREADY HAVE SLA (ONLY IN ADD MODE)
        if (!isEditMode) {
          const slaRes = await api.get("/SLARecords");
          const caseIdsWithSla = slaRes.data.map(r => r.caseID);
          availableCases = availableCases.filter(
            c => !caseIdsWithSla.includes(c.caseId)
          );
        }

        setCases(availableCases);
        setStages(stageRes.data);
      } catch {
        toast.error("Failed to load data");
      }
    };

    loadData();
  }, [isEditMode]);

  /* ================= VALIDATE ================= */
  const validate = () => {
    const e = {};
    if (!form.caseId) e.caseId = "Case is required";
    if (!form.stageId) e.stageId = "Workflow stage is required";
    if (!form.startDate) e.startDate = "Start date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (isEditMode) {
        // ✅ UPDATE START DATE
        await api.put(`/SLARecords/${record.slaRecordID}`, {
          startDate: new Date(form.startDate).toISOString()
        });
        toast.success("SLA start date updated");
      } else {
        // ✅ CREATE SLA RECORD
        await api.post("/SLARecords", {
          caseId: Number(form.caseId),
          stageId: Number(form.stageId),
          startDate: new Date(form.startDate).toISOString()
        });
        toast.success("SLA record created");
      }

      onSave();
    } catch {
      toast.error("Operation failed");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEditMode ? "Update SLA Start Date" : "Add SLA Record"}</h4>

        <form onSubmit={handleSubmit}>
          {/* CASE */}
          <label>Case</label>
          <select
            className={`form-control ${errors.caseId ? "is-invalid" : ""}`}
            value={form.caseId}
            disabled={isEditMode}
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

          {/* WORKFLOW STAGE */}
          <label>Workflow Stage</label>
          <select
            className={`form-control ${errors.stageId ? "is-invalid" : ""}`}
            value={form.stageId}
            disabled={isEditMode}
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

          {/* START DATE */}
          <label>Start Date</label>
          <input
            type="date"
            className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
          />
          {errors.startDate && (
            <small className="error-text">{errors.startDate}</small>
          )}

          <div className="actions-row">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}