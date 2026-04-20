import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./slaRecords.css";
import { Plus, Trash2, Timer, Pencil } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import SLARecordForm from "./SLARecordForm";
import { useLocation, useNavigate } from "react-router-dom";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SLARecordsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isPendingView = location.state?.view === "pending";

  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ========= LOAD DATA ========= */
  const loadAll = async () => {
    try {
      const res = await api.get("/SLARecords");
      setRecords(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load SLA records");
    }
  };

  const loadPendingCases = async () => {
    try {
      const res = await api.get("/SLARecords/pending-cases");
      setRecords(res.data);
      setFiltered(res.data);
      setPendingCount(res.data.length);
    } catch {
      toast.error("Failed to load pending SLA cases");
    }
  };

  useEffect(() => {
    isPendingView ? loadPendingCases() : loadAll();
  }, [isPendingView]);

  /* ========= FILTER ========= */
  useEffect(() => {
    if (isPendingView) return;

    let data = records;

    if (search.trim()) {
      data = data.filter(r =>
        r.caseID.toString().includes(search)
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter(r => r.status === statusFilter);
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, statusFilter, records, isPendingView]);

  /* ========= PIE ========= */
  const onTimeCount = records.filter(r => r.status === "OnTime").length;
  const breachedCount = records.filter(r => r.status === "Breached").length;

  const pieData = {
    labels: ["On Time", "Breached"],
    datasets: [
      {
        data: [onTimeCount, breachedCount],
        backgroundColor: ["#16a34a", "#dc2626"]
      }
    ]
  };

  /* ========= PAGINATION ========= */
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  /* ========= DELETE ========= */
  const deleteRecord = async (id) => {
    if (!window.confirm("Delete SLA record?")) return;
    try {
      await api.delete(`/SLARecords/${id}`);
      toast.success("SLA record deleted");
      loadAll();
    } catch {
      toast.error("Failed to delete SLA record");
    }
  };

  return (
    <div className="sla-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="sla-header">
        <div>
          <h2 className="page-title">
            {isPendingView ? "Cases Requiring SLA Setup" : "SLA Record Tracking"}
          </h2>
          <p className="page-subtitle">
            {isPendingView
              ? "Create SLA records for pending cases"
              : "Monitor SLA compliance for all cases"}
          </p>
        </div>

        <div className="sla-count-card">
          <div className="icon-bg">
            <Timer size={28} color="#1e3a8a" />
          </div>
          <div>
            <p>{isPendingView ? "Pending SLA Cases" : "Total SLA Records"}</p>
            <h3>{isPendingView ? pendingCount : records.length}</h3>
          </div>
        </div>
      </div>

      {/* PIE + FILTER */}
      {!isPendingView && (
        <>
          <div className="sla-chart-card">
            <h3>SLA Compliance Distribution</h3>
            <div className="sla-chart-wrapper">
              <Pie data={pieData} />
            </div>
          </div>

          <div className="filter-row">
            <input
              className="form-control"
              placeholder="Search by Case ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              className="form-control"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="OnTime">On Time</option>
              <option value="Breached">Breached</option>
            </select>

            <button className="btn btn-primary" onClick={() => setShowForm({})}>
              <Plus size={16} /> Create SLA Record
            </button>
          </div>
        </>
      )}

      {/* TABLE */}
      <table className="table-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Case</th>
            <th>Stage</th>
            <th>Start</th>
            <th>End</th>
            <th>SLA Status</th>
            <th className="actions-col">Action</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan={7} className="empty-msg">
                No SLA records found.
              </td>
            </tr>
          ) : (
            currentData.map(item => (
              <tr key={item.slaRecordID}>
                <td>{item.slaRecordID}</td>
                <td>CASE-{item.caseID}</td>
                <td>{item.stageID}</td>
                <td>{new Date(item.startDate).toLocaleDateString()}</td>
                <td>{new Date(item.endDate).toLocaleDateString()}</td>
                <td>
                  <span
                    className={`badge ${
                      item.status === "OnTime" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="actions-col">
                  {/* ✅ EDIT START DATE */}
                  <Pencil
                    size={18}
                    className="icon-edit"
                    onClick={() => setShowForm(item)}
                  />
                  <Trash2
                    size={18}
                    className="icon-delete"
                    onClick={() => deleteRecord(item.slaRecordID)}
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

      {/* ✅ FORM POPUP */}
      {showForm && (
        <SLARecordForm
          record={showForm}
          onClose={() => setShowForm(null)}
          onSave={() => {
            setShowForm(null);
            loadAll();
          }}
        />
      )}
    </div>
  );
}
