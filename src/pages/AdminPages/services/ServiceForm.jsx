import React, { useState, useEffect } from "react";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function ServiceForm({ service, onClose, onSave }) {
  const [departments, setDepartments] = useState([]);

  // ✅ Use correct backend field names
  const [form, setForm] = useState({
    departmentID: service.departmentID || "",
    serviceName: service.serviceName || "",
    description: service.description || "",
    sLa_Days: service.slA_Days || "", // ✅ backend returns sLa_Days
    status: service.status || "Active",
  });

  const loadDepartments = async () => {
    try {
      const res = await api.get("/Department");
      setDepartments(res.data);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      departmentID: Number(form.departmentID),
      serviceName: form.serviceName,
      description: form.description,
      sLa_Days: Number(form.slA_Days), // ✅ correct
      status: form.status,
    };

    try {
      if (service.serviceID) {
        await api.put(`/Services/${service.serviceID}`, payload);
        toast.success("Service updated");
      } else {
        await api.post(`/Services`, payload);
        toast.success("Service created");
      }

      onSave();
    } catch {
      toast.error("Error saving service");
    }
  };

  return (
    <div className="form-modal">
      <div className="modal-card">
        <h4>{service.serviceID ? "Edit Service" : "Add Service"}</h4>

        <form onSubmit={handleSubmit}>

          {/* Department */}
          <label>Department</label>
          <select
            className="form-control mb-2"
            value={form.departmentID}
            onChange={(e) =>
              setForm({ ...form, departmentID: e.target.value })
            }
            required
          >
            <option value="">Select Department</option>
            {departments.map((d) => (
              <option key={d.departmentID} value={d.departmentID}>
                {d.departmentName}
              </option>
            ))}
          </select>

          {/* Service Name */}
          <label>Service Name</label>
          <input
            className="form-control mb-2"
            value={form.serviceName}
            onChange={(e) =>
              setForm({ ...form, serviceName: e.target.value })
            }
            required
          />

          {/* Description */}
          <label>Description</label>
          <textarea
            className="form-control mb-2"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          {/* SLA Days */}
          <label>SLA Days</label>
          <input
            type="number"
            className="form-control mb-2"
            value={form.slA_Days}
            onChange={(e) =>
              setForm({ ...form, slA_Days: e.target.value })
            }
            required
          />

          {/* Status */}
          <label>Status</label>
          <select
            className="form-control mb-3"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>

          {/* Buttons */}
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