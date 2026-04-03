import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./department.css";
import { ToastContainer, toast } from "react-toastify";
import { Plus, Pencil, Trash2, Building2 } from "lucide-react";
import DepartmentForm from "./DepartmentForm";
import Pagination from "../../../components/AdminComponents/common/Pagination";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await api.get("/Department");
      setDepartments(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    let data = departments;

    if (search.trim()) {
      data = data.filter(d =>
        d.departmentName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      data = data.filter(d => d.status === statusFilter);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, statusFilter, departments]);

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="dept-container">
      <ToastContainer />

      {/* Header */}
      <div className="dept-header">
        <div>
          <h2 className="page-title">Department Management</h2>
          <p className="page-subtitle">Manage all government departments.</p>
        </div>

        <div className="dept-stats-card">
          <div className="stats-icon">
            <Building2 size={30} color="#1e3a8a" />
          </div>
          <div>
            <p className="stats-label">Total Departments</p>
            <h3 className="stats-value">{departments.length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search departments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="InActive">InActive</option>
        </select>

        <button className="btn btn-primary create-btn" onClick={() => setShowForm({})}>
          <Plus size={18} /> Add Department
        </button>
      </div>

      {/* Table */}
      <table className="table table-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-msg">
                No departments found matching your search or filter.
              </td>
            </tr>
          ) : (
            currentData.map(d => (
              <tr key={d.departmentID}>
                <td>{d.departmentID}</td>
                <td>{d.departmentName}</td>
                <td>{d.description}</td>
                <td>
                  <span className={`badge ${d.status === "Active" ? "bg-success" : "bg-secondary"}`}>
                    {d.status}
                  </span>
                </td>
                <td className="actions-col">
                  <Pencil size={18} className="icon-edit" onClick={() => setShowForm(d)} />
                  <Trash2 size={18} className="icon-delete" onClick={() => {
                    if (window.confirm("Delete this department?")) {
                      api.delete(`/Department/${d.departmentID}`).then(loadData);
                    }
                  }} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={page => setCurrentPage(page)}
      />

      {showForm && (
        <DepartmentForm
          department={showForm}
          onClose={() => setShowForm(null)}
          onSave={loadData}
        />
      )}
    </div>
  );
}