import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./slaDays.css";
import { Plus, Pencil, Trash2, Timer } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import SLADayForm from "./SLADayForm";

export default function SLADaysPage() {
  const [slaDays, setSlaDays] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await api.get("/sladays");
      setSlaDays(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load SLA Days");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ✅ SEARCH LOGIC */
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(slaDays);
    } else {
      const value = search.toLowerCase();
      setFiltered(
        slaDays.filter(
          s =>
            s.serviceName.toLowerCase().includes(value) ||
            s.roleName.toLowerCase().includes(value) ||
            String(s.days).includes(value)
        )
      );
    }
    setCurrentPage(1);
  }, [search, slaDays]);

  /* Pagination */
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const deleteSlaDay = async (id) => {
    if (!window.confirm("Delete this SLA configuration?")) return;
    await api.delete(`/sladays/${id}`);
    toast.success("SLA Day deleted");
    loadData();
  };

  return (
    <div className="sla-days-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="sla-days-header">
        <div>
          <h2 className="page-title">SLA Days Configuration</h2>
          <p className="page-subtitle">
            Configure SLA per Service and Role
          </p>
        </div>

        <div className="sla-days-count-card">
          <div className="icon-bg">
            <Timer size={28} color="#1e293b" />
          </div>
          <div>
            <p>Total SLA Entries</p>
            <h3>{slaDays.length}</h3>
          </div>
        </div>
      </div>

      {/* SEARCH + ADD */}
      <div className="sla-search-row">
        <input
          className="form-control"
          placeholder="Search SLA days..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={() => setShowForm({})}
        >
          <Plus size={16} /> Add SLA Days
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Role</th>
              <th>SLA Days</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-msg">
                  No SLA configurations found matching your search.
                </td>
              </tr>
            ) : (
              currentData.map((s) => (
                <tr key={s.slaDayID}>
                  <td>{s.slaDayID}</td>
                  <td>{s.serviceName}</td>
                  <td>{s.roleName}</td>
                  <td>
                    <span className="sla-day-badge">
                      {s.days} days
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
                      onClick={() => deleteSlaDay(s.slaDayID)}
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
      </div>

      {showForm && (
        <SLADayForm
          data={showForm}
          onClose={() => setShowForm(null)}
          onSave={() => {
            setShowForm(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}