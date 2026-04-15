import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function ServiceForm({ service = {}, onClose, onSave }) {
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

  /* ✅ Initialize form when editing */
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

  /* ✅ Load departments ONLY for CREATE */
  useEffect(() => {
    if (!isEdit) {
      api
        .get("/Department")
        .then(res => setDepartments(res.data))
        .catch(() =>
          toast.error("Unable to load departments. Please try again.")
        );
    }
  }, [isEdit]);

  /* ✅ Validation */
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
          "Service name must be at least 3 characters long.";
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

  /*  Submit */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    //  DO NOT send immutable fields on UPDATE
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
          ? "Unable to update service. Please try again."
          : "Service with this name already exists."
      );
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{isEdit ? "Edit Service" : "Add Service"}</h4>

        <form onSubmit={handleSubmit}>
          {/*  Department */}
          {!isEdit ? (
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
                <small className="error-text">{errors.departmentID}</small>
              )}
            </>
          ) : (
            <div className="readonly-field">
              <label>Department</label>
              <div className="readonly-value">
                {service.departmentName}
              </div>
              <small className="text-muted">
                Department cannot be changed once the service is created.
              </small>
            </div>
          )}

          {/*  Service Name */}
          <label>Service Name</label>
          {isEdit ? (
            <>
              <input
                className="form-control"
                value={service.serviceName}
                disabled
              />
              <small className="text-muted">
                Service name cannot be changed once created.
              </small>
            </>
          ) : (
            <>
              <input
                className={`form-control ${
                  errors.serviceName ? "is-invalid" : ""
                }`}
                value={form.serviceName}
                onChange={(e) =>
                  setForm({ ...form, serviceName: e.target.value })
                }
              />
              {errors.serviceName && (
                <small className="error-text">{errors.serviceName}</small>
              )}
            </>
          )}

          {/*  Description */}
          <label>Description</label>
          <textarea
            className="form-control"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/*  SLA Days */}
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
            <small className="error-text">{errors.slA_Days}</small>
          )}

          {/*  Status */}
          <label>Status</label>
          <select
            className={`form-control ${errors.status ? "is-invalid" : ""}`}
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          {errors.status && (
            <small className="error-text">{errors.status}</small>
          )}

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
