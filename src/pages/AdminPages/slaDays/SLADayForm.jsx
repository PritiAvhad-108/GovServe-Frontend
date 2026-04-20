import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SLADayForm({ data = {}, onClose, onSave }) {
  const isEdit = !!data.slaDayID;

  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    serviceID: data.serviceID || "",
    roleID: data.roleID || "",
    days: data.days ?? ""
  });

  useEffect(() => {
    if (!isEdit) {
      api.get("/Services").then(res => setServices(res.data));
    }
    api.get("/Roles").then(res => setRoles(res.data));
  }, [isEdit]);

  /*  VALIDATION */
  const validateForm = () => {
    const newErrors = {};

    if (!isEdit && !form.serviceID) {
      newErrors.serviceID = "Service is required.";
    }

    if (!form.roleID) {
      newErrors.roleID = "Role is required.";
    }

    if (form.days === "") {
      newErrors.days = "SLA Days is required.";
    } else if (Number(form.days) < 0) {
      newErrors.days = "Minimum SLA Days is 0.";
    } else if (Number(form.days) > 365) {
      newErrors.days = "Maximum SLA Days is 365.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = isEdit
      ? {
          roleID: Number(form.roleID),
          days: Number(form.days)
        }
      : {
          serviceID: Number(form.serviceID),
          roleID: Number(form.roleID),
          days: Number(form.days)
        };

    try {
      if (isEdit) {
        await api.put(`/sladays/${data.slaDayID}`, payload);
        toast.success("SLA Days updated successfully");
      } else {
        await api.post("/sladays", payload);
        toast.success("SLA Days created successfully");
      }
      onSave();
      onClose();
    } catch {
      toast.error("SLA already exists for this Service and Role.");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit SLA Days" : "Add SLA Days"}</h4>

        {/*  SERVICE */}
        <label>Service</label>
        {isEdit ? (
          <>
            <input
              className="form-control fixed-field"
              value={data.serviceName}
              disabled
            />
            <small className="text-muted">
              Service cannot be changed once SLA is created.
            </small>
          </>
        ) : (
          <>
            <select
              className={`form-control ${errors.serviceID ? "is-invalid" : ""}`}
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
            {errors.serviceID && (
              <small className="error-text">{errors.serviceID}</small>
            )}
          </>
        )}

        {/*  ROLE */}
        <label>Role</label>
        <select
          className={`form-control ${errors.roleID ? "is-invalid" : ""}`}
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
        {errors.roleID && (
          <small className="error-text">{errors.roleID}</small>
        )}

        {/* SLA DAYS */}
        <label>SLA Days</label>
        <input
          type="number"
          className={`form-control ${errors.days ? "is-invalid" : ""}`}
          value={form.days}
          onChange={e => setForm({ ...form, days: e.target.value })}
        />
        {errors.days && (
          <small className="error-text">{errors.days}</small>
        )}

        <div className="actions-row">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}