import React, { useEffect, useState } from "react";
import api from "../../../api/api";

export default function ReportFilterForm({ onGenerate, loading }) {
  const [scope, setScope] = useState("");
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);

  const [filters, setFilters] = useState({
    departmentId: "",
    serviceId: "",
    startDate: ""
  });

  useEffect(() => {
    //  CORRECT ENDPOINTS
    api.get("/Department/active").then(res => setDepartments(res.data));
    api.get("/Services/active").then(res => setServices(res.data));
  }, []);

  const submit = (e) => {
    e.preventDefault();

    const payload = {
      scope,
      departmentId: scope === "Department" ? Number(filters.departmentId) : null,
      serviceId: scope === "Service" ? Number(filters.serviceId) : null,
      startDate: scope === "Period" ? filters.startDate : null
    };

    onGenerate(payload);
  };

  return (
    <form className="report-filter-card" onSubmit={submit}>
      <div className="filter-row">
        <select
          className="form-control"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          required
        >
          <option value="">Select Report Scope</option>
          <option value="Department">By Department</option>
          <option value="Service">By Service</option>
          <option value="Period">By Period</option>
        </select>

        {scope === "Department" && (
          <select
            className="form-control"
            value={filters.departmentId}
            onChange={(e) =>
              setFilters({ ...filters, departmentId: e.target.value })
            }
            required
          >
            <option value="">Select Department</option>
            {departments.map(d => (
              <option key={d.departmentID} value={d.departmentID}>
                {d.departmentName}
              </option>
            ))}
          </select>
        )}

        {scope === "Service" && (
          <select
            className="form-control"
            value={filters.serviceId}
            onChange={(e) =>
              setFilters({ ...filters, serviceId: e.target.value })
            }
            required
          >
            <option value="">Select Service</option>
            {services.map(s => (
              <option key={s.serviceID} value={s.serviceID}>
                {s.serviceName}
              </option>
            ))}
          </select>
        )}

        {scope === "Period" && (
          <input
            type="date"
            className="form-control"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            required
          />
        )}

        <button className="btn btn-primary" disabled={loading}>
          Generate Report
        </button>
      </div>
    </form>
  );
}