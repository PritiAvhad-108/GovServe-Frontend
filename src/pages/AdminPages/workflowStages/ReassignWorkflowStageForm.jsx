import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function ReassignWorkflowStageForm({ stage, onClose, onSave }) {
  const [roles, setRoles] = useState([]);
  const [newRoleID, setNewRoleID] = useState("");

  useEffect(() => {
    api.get("/Roles").then(res => setRoles(res.data));
  }, []);

  const handleReassign = async () => {
    if (!newRoleID) {
      toast.error("Please select a role");
      return;
    }

    try {
      await api.put(`/WorkflowStages/${stage.stageID}/reassign`, {
        newRoleID: Number(newRoleID)
      });
      toast.success("Workflow stage reassigned");
      onSave();
      onClose();
    } catch (err) {
      toast.error(err.response?.data || "Reassign failed");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>Reassign Workflow Stage</h4>

        <label>New Responsible Role</label>
        <select
          className="form-control mb-3"
          value={newRoleID}
          onChange={e => setNewRoleID(e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map(r => (
            <option key={r.roleID} value={r.roleID}>
              {r.roleName}
            </option>
          ))}
        </select>

        <div className="actions-row">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleReassign}>
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
}
