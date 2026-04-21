import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function WorkflowStageForm({ stage = {}, onClose, onSave }) {
  const isEdit = !!stage.stageID;

  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    serviceID: stage.serviceID || "",
    roleID: stage.roleID || "",
    sequenceNumber: stage.sequenceNumber || ""
  });

  /* Load dropdown data */
  useEffect(() => {
    api.get("/Services/active").then(res => setServices(res.data));
    api.get("/Roles").then(res => setRoles(res.data));
  }, []);

  /* VALIDATION – INLINE LIKE SERVICE */
  const validateForm = () => {
    const newErrors = {};

    if (!form.serviceID && !isEdit) {
      newErrors.serviceID = "Please select a service.";
    }

    if (!form.roleID) {
      newErrors.roleID = "Please select a role.";
    }

    if (!form.sequenceNumber || Number(form.sequenceNumber) <= 0) {
      newErrors.sequenceNumber =
        "Sequence number must be a positive number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      serviceID: Number(form.serviceID),
      roleID: Number(form.roleID),
      sequenceNumber: Number(form.sequenceNumber)
    };

    try {
      if (isEdit) {
        await api.put(`/WorkflowStages/${stage.stageID}`, payload);
        toast.success("Workflow stage updated successfully");
      } else {
        await api.post("/WorkflowStages", payload);
        toast.success("Workflow stage created successfully");
      }

      onSave();
      onClose();
    } catch {
      //  SYSTEM ERROR → TOAST
      toast.error("Failed to save workflow stage. Please try again.");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit Workflow Stage" : "Add Workflow Stage"}</h4>

        <form onSubmit={handleSubmit}>
          {/* SERVICE */}
          <label>Service</label>
          {isEdit ? (
            <>
              <input
                className="form-control"
                value={stage.serviceName || ""}
                disabled
              />
              <small className="text-muted">
                Service cannot be changed once created.
              </small>
            </>
          ) : (
            <>
              <select
                className={`form-control ${
                  errors.serviceID ? "is-invalid" : ""
                }`}
                value={form.serviceID}
                onChange={(e) => {
                  setForm({ ...form, serviceID: e.target.value });
                  setErrors({ ...errors, serviceID: "" });
                }}
              >
                <option value="">Select Service</option>
                {services.map((s) => (
                  <option key={s.serviceID} value={s.serviceID}>
                    {s.serviceName}
                  </option>
                ))}
              </select>
              {errors.serviceID && (
                <small className="error-text">{errors.serviceID}</small>
              )}
            </>
          )}

          {/* ROLE */}
          <label>Responsible Role</label>
          <select
            className={`form-control ${
              errors.roleID ? "is-invalid" : ""
            }`}
            value={form.roleID}
            onChange={(e) => {
              setForm({ ...form, roleID: e.target.value });
              setErrors({ ...errors, roleID: "" });
            }}
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.roleID} value={r.roleID}>
                {r.roleName}
              </option>
            ))}
          </select>
          {errors.roleID && (
            <small className="error-text">{errors.roleID}</small>
          )}

          {/* SEQUENCE */}
          <label>Sequence Number</label>
          <input
            type="number"
            className={`form-control ${
              errors.sequenceNumber ? "is-invalid" : ""
            }`}
            value={form.sequenceNumber}
            onChange={(e) => {
              setForm({ ...form, sequenceNumber: e.target.value });
              setErrors({ ...errors, sequenceNumber: "" });
            }}
          />
          {errors.sequenceNumber && (
            <small className="error-text">
              {errors.sequenceNumber}
            </small>
          )}

          <div className="actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
