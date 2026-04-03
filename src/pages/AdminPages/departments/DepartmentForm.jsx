import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function DepartmentForm({ department, onClose, onSave }) {
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    departmentName: department.departmentName || "",
    description: department.description || "",
    status: department.status || "Active"
  });

  const validateForm = () => {
    const newErrors = {};

    if (!form.departmentName.trim()) {
      newErrors.departmentName = "Department name is required";
    } else if (form.departmentName.trim().length < 3) {
      newErrors.departmentName = "Name must be at least 3 characters";
    }

    if (!form.status) {
      newErrors.status = "Status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      departmentName: form.departmentName.trim(),
      description: form.description.trim(),
      status: form.status
    };

    try {
      if (department.departmentID) {
        await api.put(`/Department/${department.departmentID}`, payload);
        toast.success("Department updated successfully");
      } else {
        await api.post(`/Department`, payload);
        toast.success("Department created successfully");
      }
      onSave();
    } catch (err) {
      toast.error("Department with this name already exists");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{department.departmentID ? "Edit Department" : "Create Department"}</h4>

        <form onSubmit={handleSubmit}>
          {/* Department Name */}
          <label>Name</label>
          {department.departmentID ? (
            <input
              type="text"
              className="form-control"
              value={department.departmentName}
              disabled
            />
          ) : (
            <input
              className={`form-control ${errors.departmentName ? "is-invalid" : ""}`}
              value={form.departmentName}
              onChange={(e) =>
                setForm({ ...form, departmentName: e.target.value })
              }
            />
          )}
          {department.departmentID && (
            <small className="text-muted">
              Department name cannot be changed once created.
            </small>
          )}
          {errors.departmentName && (
            <small className="error-text">{errors.departmentName}</small>
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

          {/* Status */}
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
          {errors.status && <small className="error-text">{errors.status}</small>}

          <div className="actions-row">
            <button className="btn btn-secondary" type="button" onClick={onClose}>
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