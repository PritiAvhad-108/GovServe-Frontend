import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function SLADayForm({ data, onClose, onSave }) {
  const [services, setServices] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    serviceID: data.serviceID || "",
    roleID: data.roleID || "",
    days: data.days || ""
  });

  useEffect(() => {
    api.get("/Services")
      .then(res => setServices(res.data))
      .catch(() => toast.error("Failed to load services"));

    api.get("/Roles")
      .then(res => setRoles(res.data))
      .catch(() => toast.error("Failed to load roles"));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!form.serviceID) newErrors.serviceID = "Service is required";
    if (!form.roleID) newErrors.roleID = "Role is required";

    if (form.days === "") newErrors.days = "SLA days is required";
    else if (isNaN(form.days)) newErrors.days = "SLA days must be a number";
    else if (Number(form.days) < 0) newErrors.days = "Minimum SLA days is 0";
    else if (Number(form.days) > 365)
      newErrors.days = "Maximum SLA days is 365";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const payload = {
      serviceID: Number(form.serviceID),
      roleID: Number(form.roleID),
      days: Number(form.days)
    };

    try {
      if (data.slaDayID) {
        await api.put(`/sladays/${data.slaDayID}`, payload);
        toast.success("SLA Days updated");
      } else {
        await api.post("/sladays", payload);
        toast.success("SLA Days created");
      }
      onSave();
    } catch (err) {
      toast.error("SLA already exists for this Service & Role");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{data.slaDayID ? "Edit SLA Days" : "Add SLA Days"}</h4>

        {/* SERVICE */}
        <label>Service</label>

        {data.slaDayID ? (
          /* ✅ EDIT MODE – READ‑ONLY SERVICE NAME */
          <input
            type="text"
            className="form-control"
            value={data.serviceName}   // ✅ shows correct service for that row
            disabled
          />
        ) : (
          /* ✅ ADD MODE – SELECT SERVICE */
          <select
            className={`form-control ${errors.serviceID ? "is-invalid" : ""}`}
            value={form.serviceID}
            onChange={(e) =>
              setForm({ ...form, serviceID: e.target.value })
            }
          >
            <option value="">Select Service</option>
            {services.map((s) => (
              <option key={s.serviceID} value={s.serviceID}>
                {s.serviceName}
              </option>
            ))}
          </select>
        )}

        {errors.serviceID && (
          <small className="error-text">{errors.serviceID}</small>
        )}
        {data.slaDayID && (
          <small className="text-muted">
            Service cannot be changed once SLA is created.
          </small>
        )}

        {errors.serviceID && <small className="error-text">{errors.serviceID}</small>}

        <br></br>
        {/* ROLE */}
        <label>Role</label>
        <select
          className={`form-control ${errors.roleID ? "is-invalid" : ""}`}
          value={form.roleID}
          onChange={(e) =>
            setForm({ ...form, roleID: e.target.value })
          }
        >
          <option value="">Select Role</option>
          {roles.map(r => (
            <option key={r.roleID} value={r.roleID}>
              {r.roleName}
            </option>
          ))}
        </select>
        {errors.roleID && <small className="error-text">{errors.roleID}</small>}

        {/* SLA DAYS */}
        <label>SLA Days</label>
        <input
          type="number"
          min="0"
          max="365"
          className={`form-control ${errors.days ? "is-invalid" : ""}`}
          value={form.days}
          onChange={(e) =>
            setForm({ ...form, days: e.target.value })
          }
        />
        {errors.days && <small className="error-text">{errors.days}</small>}

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