import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./services.css";
import { ToastContainer, toast } from "react-toastify";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import ServiceForm from "./ServiceForm";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import { useNavigate } from "react-router-dom";

export default function ServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(null);

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

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="service-container">
      <ToastContainer />

      {/* Header */}
      <div className="service-header">
        <div>
          <h2 className="page-title">Service Management</h2>
          <p className="page-subtitle">Manage government services.</p>
        </div>

        <div className="service-stats-card">
          <FolderKanban size={30} color="#1e3a8a" />
          <div>
            <p className="stats-label">Total Services</p>
            <h3 className="stats-value">{services.length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search services or departments..."
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
          onClick={() =>
            setShowForm({
              serviceID: null,
              departmentID: "",
              serviceName: "",
              description: "",
              slA_Days: "",
              status: "Active",
            })
          }
        >
          <Plus size={18} /> Add Service
        </button>
      </div>

      {/* Table */}
      <table className="table-white">
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
          {currentData.length === 0 ? (
            <tr>
              <td colSpan="7" className="empty-msg">
                No services found.
              </td>
            </tr>
          ) : (
            currentData.map((s) => (
              <tr key={s.serviceID}>
                <td>{s.serviceID}</td>
                <td>{s.departmentName}</td>
                <td
                  className="service-link"
                  onClick={() =>
                    navigate(`/admin/services/${s.serviceID}`)
                  }
                >
                  {s.serviceName}
                </td>
                <td>{s.description}</td>
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
                    onClick={() => {
                      if (window.confirm("Delete this service?")) {
                        api
                          .delete(`/Services/${s.serviceID}`)
                          .then(loadData);
                      }
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {showForm && (
        <ServiceForm
          service={showForm}
          services={services}   
          onClose={() => setShowForm(null)}
          onSave={loadData}
        />
      )}
    </div>
  );
}