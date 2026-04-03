import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function WorkflowStageForm({ stage, onClose, onSave }) {
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);

  const [form, setForm] = useState({
    serviceID: stage.serviceID || "",
    roleID: stage.roleID || "",
    sequenceNumber: stage.sequenceNumber || ""
  });

  useEffect(() => {
    api.get("/Services").then(res => setServices(res.data));
    api.get("/Roles").then(res => setRoles(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.serviceID) {
      toast.error("Please select a service");
      return;
    }

    if (!form.roleID) {
      toast.error("Please select a role");
      return;
    }

    if (!form.sequenceNumber || Number(form.sequenceNumber) <= 0) {
      toast.error("Sequence number must be a positive number");
      return;
    }

    const payload = {
      serviceID: Number(form.serviceID),
      roleID: Number(form.roleID),
      sequenceNumber: Number(form.sequenceNumber)
    };

    try {
      if (stage.stageID) {
        await api.put(`/WorkflowStages/${stage.stageID}`, payload);
        toast.success("Workflow stage updated");
      } else {
        await api.post("/WorkflowStages", payload);
        toast.success("Workflow stage created");
      }

      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data || "Failed to save workflow stage");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{stage.stageID ? "Edit Workflow Stage" : "Add Workflow Stage"}</h4>

        <form onSubmit={handleSubmit}>
          <label>Service</label>
          <select
            className="form-control mb-2"
            value={form.serviceID}
            onChange={e => setForm({ ...form, serviceID: e.target.value })}
          >
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s.serviceID} value={s.serviceID}>
                {s.serviceName}
              </option>
            ))}
          </select>

          <label>Responsible Role</label>
          <select
            className="form-control mb-2"
            value={form.roleID}
            onChange={e => setForm({ ...form, roleID: e.target.value })}
          >
            <option value="">Select Role</option>
            {roles.map(r => (
              <option key={r.roleID} value={r.roleID}>
                {r.roleName}
              </option>
            ))}
          </select>

          <label>Sequence Number</label>
          <input
            type="number"
            className="form-control mb-3"
            min="1"
            step="1"
            value={form.sequenceNumber}
            onChange={e => setForm({ ...form, sequenceNumber: e.target.value })}
          />

          <div className="actions-row">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}