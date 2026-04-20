import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./workflowStages.css";
import {
  Plus,
  Pencil,
  Trash2,
  Workflow,
  Repeat,
  Clock
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import WorkflowStageForm from "./WorkflowStageForm";
import ReassignWorkflowStageForm from "./ReassignWorkflowStageForm";
import { useNavigate } from "react-router-dom";

export default function WorkflowStagesPage() {
  const navigate = useNavigate();

  const [stages, setStages] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceFilter, setServiceFilter] = useState("");

  const [showForm, setShowForm] = useState(null);
  const [showReassign, setShowReassign] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadAllStages = async () => {
    try {
      const res = await api.get("/WorkflowStages");
      setStages(res.data);
    } catch {
      toast.error("Failed to load workflow stages");
    }
  };

  const loadServices = async () => {
    const res = await api.get("/Services");
    setServices(res.data);
  };

  useEffect(() => {
    loadAllStages();
    loadServices();
  }, []);

  const searchByService = async (serviceId) => {
    setServiceFilter(serviceId);

    if (!serviceId) {
      loadAllStages();
      return;
    }

    try {
      const res = await api.get(`/WorkflowStages/service/${serviceId}`);
      setStages(res.data);
      setCurrentPage(1);
    } catch {
      setStages([]);
      toast.info("No workflow stages found for selected service");
    }
  };

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = stages.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(stages.length / itemsPerPage);

  const deleteStage = async (id) => {
    if (!window.confirm("Delete this workflow stage?")) return;

    try {
      await api.delete(`/WorkflowStages/${id}`);
      toast.success("Workflow stage deleted");
      loadAllStages();
    } catch {
      toast.error("Error deleting workflow stage");
    }
  };

  return (
    <div className="workflow-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="workflow-header">
        <div>
          <h2 className="page-title">Workflow Stages</h2>
          <p className="page-subtitle">
            Manage workflow stages per service
          </p>
        </div>

        <div className="workflow-stats-card">
          <div className="stats-icon">
            <Workflow size={28} color="#2563eb" />
          </div>
          <div>
            <p className="stats-label">Total Stages</p>
            <h3 className="stats-value">{stages.length}</h3>
          </div>
        </div>
      </div>

      {/* FILTER + ACTIONS */}
      <div className="filter-row">
        {/* SERVICE FILTER */}
        <select
          className="form-control"
          value={serviceFilter}
          onChange={(e) => searchByService(e.target.value)}
        >
          <option value="">All Services</option>
          {services.map((s) => (
            <option key={s.serviceID} value={s.serviceID}>
              {s.serviceName}
            </option>
          ))}
        </select>

        {/* ACTION BUTTONS */}
        <div style={{ display: "flex", gap: "10px" }}>
          {/*  SLA DAYS CONFIGURATION */}
          <button
            className="btn btn-primary create-btn"
            onClick={() => navigate("/admin/sla-days")}
          >
            <Clock size={16} color="white" style={{ marginRight: 6 }} />
            SLA Days Configuration
          </button>

          {/*  ADD WORKFLOW STAGE */}
          <button
            className="btn btn-primary create-btn"
            onClick={() => setShowForm({})}
          >
            <Plus size={16} color="white" style={{ marginRight: 6 }} />
            Add Workflow Stage
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Role</th>
              <th>Sequence</th>
              <th>SLA Days</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((s) => (
              <tr key={s.stageID}>
                <td>{s.stageID}</td>
                <td>{s.serviceName}</td>
                <td>{s.responsibleRole}</td>
                <td>{s.sequenceNumber}</td>
                <td>
                  <span className="sla-badge">{s.slA_Days}</span>
                </td>
                <td className="actions-col">
                  <Pencil
                    size={18}
                    className="icon-edit"
                    onClick={() => setShowForm(s)}
                  />
                  <Repeat
                    size={18}
                    className="icon-reassign"
                    onClick={() => setShowReassign(s)}
                  />
                  <Trash2
                    size={18}
                    className="icon-delete"
                    onClick={() => deleteStage(s.stageID)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* MODALS */}
      {showForm && (
        <WorkflowStageForm
          stage={showForm}
          onClose={() => setShowForm(null)}
          onSave={loadAllStages}
        />
      )}

      {showReassign && (
        <ReassignWorkflowStageForm
          stage={showReassign}
          onClose={() => setShowReassign(null)}
          onSave={loadAllStages}
        />
      )}
    </div>
  );
}