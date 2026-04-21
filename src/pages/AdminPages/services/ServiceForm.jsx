import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function ServiceForm({
  service = {},
  services = [],     // ✅ all existing services
  onClose,
  onSave,
}) {
  const isEdit = !!service.serviceID;

  const [departments, setDepartments] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    departmentID: "",
    serviceName: "",
    description: "",
    slA_Days: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEdit) {
      setForm({
        departmentID: service.departmentID,
        serviceName: service.serviceName,
        description: service.description || "",
        slA_Days: service.slA_Days || "",
        status: service.status || "Active",
      });
    }
  }, [isEdit, service]);

  useEffect(() => {
    if (!isEdit) {
      api
        .get("/Department/active")
        .then((res) => setDepartments(res.data))
        .catch(() =>
          toast.error("Unable to load departments.")
        );
    }
  }, [isEdit]);

  const validateForm = () => {
    const newErrors = {};

    if (!isEdit && !form.departmentID) {
      newErrors.departmentID = "Please select a department.";
    }

    if (!isEdit) {
      if (!form.serviceName.trim()) {
        newErrors.serviceName = "Service name is required.";
      } else if (form.serviceName.trim().length < 3) {
        newErrors.serviceName =
          "Service name must be at least 3 characters.";
      } else {
        // ✅ DUPLICATE CHECK
        const exists = services.some(
          (s) =>
            s.serviceName.toLowerCase() ===
            form.serviceName.trim().toLowerCase()
        );

        if (exists) {
          newErrors.serviceName = "Service name already exists.";
        }
      }
    }

    if (!form.slA_Days || Number(form.slA_Days) <= 0) {
      newErrors.slA_Days = "SLA Days must be a positive number.";
    }

    if (!form.status) {
      newErrors.status = "Status is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = isEdit
      ? {
          description: form.description.trim(),
          slA_Days: Number(form.slA_Days),
          status: form.status,
        }
      : {
          departmentID: Number(form.departmentID),
          serviceName: form.serviceName.trim(),
          description: form.description.trim(),
          slA_Days: Number(form.slA_Days),
          status: form.status,
        };

    try {
      if (isEdit) {
        await api.put(`/Services/${service.serviceID}`, payload);
        toast.success("Service updated successfully.");
      } else {
        await api.post("/Services", payload);
        toast.success("Service created successfully.");
      }

      await onSave();
      onClose();
    } catch {
      toast.error(
        isEdit
          ? "Unable to update service."
          : "Unable to create service."
      );
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit Service" : "Add Service"}</h4>

        <form onSubmit={handleSubmit}>
          {/* Department */}
          {!isEdit && (
            <>
              <label>Department</label>
              <select
                className={`form-control ${
                  errors.departmentID ? "is-invalid" : ""
                }`}
                value={form.departmentID}
                onChange={(e) =>
                  setForm({ ...form, departmentID: e.target.value })
                }
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.departmentID} value={d.departmentID}>
                    {d.departmentName}
                  </option>
                ))}
              </select>
              {errors.departmentID && (
                <small className="error-text">
                  {errors.departmentID}
                </small>
              )}
            </>
          )}

          {/* Service Name */}
          <label>Service Name</label>
          {!isEdit ? (
            <>
              <input
                className={`form-control ${
                  errors.serviceName ? "is-invalid" : ""
                }`}
                value={form.serviceName}
                onChange={(e) => {
                  setForm({ ...form, serviceName: e.target.value });
                  setErrors({ ...errors, serviceName: "" });
                }}
              />
              {errors.serviceName && (
                <small className="error-text">
                  {errors.serviceName}
                </small>
              )}
            </>
          ) : (
            <input
              className="form-control"
              value={service.serviceName}
              disabled
            />
          )}

          {/* Description */}
          <label>Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* SLA Days */}
          <label>SLA Days</label>
          <input
            type="number"
            className={`form-control ${
              errors.slA_Days ? "is-invalid" : ""
            }`}
            value={form.slA_Days}
            onChange={(e) =>
              setForm({ ...form, slA_Days: e.target.value })
            }
          />
          {errors.slA_Days && (
            <small className="error-text">
              {errors.slA_Days}
            </small>
          )}

          {/* Status */}
          <label>Status</label>
          <select
            className={`form-control ${
              errors.status ? "is-invalid" : ""
            }`}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>

          <div className="actions-row">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
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