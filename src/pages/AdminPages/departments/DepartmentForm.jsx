import React, { useState } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function DepartmentForm({
  department = {},          
  departments = [],         
  onClose,
  onSave,
}) {
  const [errors, setErrors] = useState({});

  //  SAFE INITIAL STATE (NO CRASH)
  const [form, setForm] = useState({
    departmentName: department?.departmentName ?? "",
    description: department?.description ?? "",
    status: department?.status ?? "Active",
  });

  //  VALIDATION WITH DUPLICATE CHECK
  const validateForm = () => {
    const newErrors = {};

    const name = form.departmentName.trim();

    if (!name) {
      newErrors.departmentName = "Department name is required.";
    } else if (name.length < 3) {
      newErrors.departmentName =
        "Department name must contain at least 3 characters.";
    } else {
      const exists = departments.some(
        (d) =>
          d.departmentName.toLowerCase() === name.toLowerCase()
      );

      //  CHECK ONLY WHILE CREATING
      if (!department.departmentID && exists) {
        newErrors.departmentName = "Department name already exists.";
      }
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

    const payload = {
      departmentName: form.departmentName.trim(),
      description: form.description.trim(),
      status: form.status,
    };

    try {
      if (department.departmentID) {
        await api.put(`/Department/${department.departmentID}`, payload);
        toast.success("Department updated successfully.");
      } else {
        await api.post("/Department", payload);
        toast.success("Department created successfully.");
      }

      onSave();
      onClose();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>
          {department.departmentID ? "Edit Department" : "Create Department"}
        </h4>

        <form onSubmit={handleSubmit}>
          {/* Department Name */}
          <label>Name</label>
          {department.departmentID ? (
            <input
              className="form-control"
              value={department.departmentName}
              disabled
            />
          ) : (
            <input
              className={`form-control ${
                errors.departmentName ? "is-invalid" : ""
              }`}
              value={form.departmentName}
              onChange={(e) => {
                setForm({ ...form, departmentName: e.target.value });
                setErrors({ ...errors, departmentName: "" });
              }}
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
            <option value="InActive">Inactive</option>
          </select>

          {errors.status && (
            <small className="error-text">{errors.status}</small>
          )}

          <div className="actions-row">
            <button
              className="btn btn-secondary"
              type="button"
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
