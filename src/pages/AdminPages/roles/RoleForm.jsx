import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function RoleForm({ role = {}, onClose, onSave }) {
  const [roleName, setRoleName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRoleName(role.roleName || "");
    setError("");
  }, [role]);

  /* VALIDATION */
  const validate = () => {
    if (!roleName.trim()) {
      return "Role name is required.";
    }
    if (roleName.trim().length < 3) {
      return "Role name must be at least 3 characters.";
    }
    if (roleName.length > 50) {
      return "Role name cannot exceed 50 characters.";
    }
    if (!/^[A-Za-z ]+$/.test(roleName)) {
      return "Role name must contain only letters and spaces.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = { roleName: roleName.trim() };

      if (role.roleID) {
        await api.put(`/Roles/${role.roleID}`, payload);
        toast.success("Role updated successfully");
      } else {
        await api.post("/Roles", payload);
        toast.success("Role created successfully");
      }

      onSave();
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Role already exists.");
      } else {
        setError("Failed to save role.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{role.roleID ? "Edit Role" : "Create Role"}</h4>

        <form onSubmit={handleSubmit}>
          <label>Role Name</label>
          <input
            className={`form-control ${error ? "is-invalid" : ""}`}
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
          />

          {error && <small className="error-text">{error}</small>}

          <div className="actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}