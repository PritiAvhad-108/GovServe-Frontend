import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./services.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import ServiceForm from "./ServiceForm";
import { useNavigate } from "react-router-dom";   // ✅ ADDED

export default function ServicesPage() {
  const navigate = useNavigate();                 // ✅ ADDED

  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(null);

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await api.get("/Services");
      setServices(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load services");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Search + Status filter
  useEffect(() => {
    let data = services;

    if (search.trim()) {
      data = data.filter(
        (s) =>
          s.serviceName.toLowerCase().includes(search.toLowerCase()) ||
          s.departmentName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "All") {
      data = data.filter((s) => s.status === statusFilter);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, statusFilter, services]);

  // ✅ Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return;

    try {
      await api.delete(`/Services/${id}`);
      toast.success("Service deleted successfully");
      loadData();
    } catch {
      toast.error("Error deleting service");
    }
  };

  return (
    <div className="service-container">
      <ToastContainer />

      {/* ✅ Header */}
      <div className="service-header">
        <div>
          <h2 className="page-title">Service Management</h2>
          <p className="page-subtitle">Manage government services</p>
        </div>

        <div className="service-stats-card">
          <div className="stats-icon">
            <FolderKanban size={30} strokeWidth={2.5} color="#2563eb" />
          </div>
          <div>
            <p className="stats-label">Total Services</p>
            <h3 className="stats-value">{services.length}</h3>
          </div>
        </div>
      </div>

      {/* ✅ Filter Row */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search services or department..."
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

        <button
          className="btn btn-primary create-btn"
          onClick={() => setShowForm({})}
        >
          <Plus size={18} color="white" /> Add Service
        </button>
      </div>

      {/* ✅ Table */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Department</th>
              <th>Service</th>
              <th>Description</th>
              <th>SLA Days</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((s) => (
              <tr key={s.serviceID}>
                <td>{s.serviceID}</td>
                <td>{s.departmentName}</td>

                {/* ✅ CLICKABLE SERVICE NAME */}
                <td
                  className="service-link"
                  onClick={() => navigate(`/admin/services/${s.serviceID}`)}
                  style={{ cursor: "pointer", color: "#2563eb" }}
                >
                  {s.serviceName}
                </td>

                <td>{s.description}</td>

                {/* ✅ SLA FIELD PRESERVED */}
                <td>{s.slA_Days}</td>

                <td>
                  <span
                    className={`badge ${
                      s.status === "Active"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>

                <td className="actions-col">
                  <Pencil
                    size={18}
                    className="icon-edit"
                    onClick={() => setShowForm(s)}
                  />
                  <Trash2
                    size={18}
                    className="icon-delete"
                    onClick={() => deleteService(s.serviceID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* ✅ Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ✅ Add / Edit Modal */}
      {showForm && (
        <ServiceForm
          service={showForm}
          onClose={() => setShowForm(null)}
          onSave={async () => {
            await loadData();
            setShowForm(null);
          }}
        />
      )}
    </div>
  );
}