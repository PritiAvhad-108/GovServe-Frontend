import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./eligibility.css";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import EligibilityRuleForm from "./EligibilityRuleForm";

export default function EligibilityRulesPage() {
  const [rules, setRules] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await api.get("/EligibilityRules");
      setRules(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load eligibility rules");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let data = rules;
    if (search.trim()) {
      data = data.filter(r =>
        r.serviceName.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(data);
    setCurrentPage(1);
  }, [search, rules]);

  const deleteRule = async (id) => {
    if (!window.confirm("Delete this rule?")) return;
    await api.delete(`/EligibilityRules/${id}`);
    toast.success("Rule deleted");
    loadData();
  };

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="eligibility-container">
      <ToastContainer />

      {/* Header */}
      <div className="eligibility-header">
        <div>
          <h2 className="page-title">Eligibility Rules</h2>
          <p className="page-subtitle">Manage eligibility rules per service</p>
        </div>

        <div className="eligibility-stats-card">
          <div className="stats-icon">
            <ShieldCheck size={28} color="#1e3a8a" />
          </div>
          <div>
            <p>Total Rules</p>
            <h3>{rules.length}</h3>
          </div>
        </div>
      </div>

      {/* Search + Add */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search by service name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary create-btn"
          onClick={() => setShowForm({})}
        >
          <Plus size={16} color="white" /> Add Rule
        </button>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((r) => (
              <tr key={r.ruleID}>
                <td>{r.ruleID}</td>
                <td>{r.serviceName}</td>
                <td>{r.ruleDescription}</td>


                <td className="actions-col">
                  <Pencil
                    className="icon-edit"
                    size={18}
                    onClick={() => setShowForm(r)}
                  />
                  <Trash2
                    className="icon-delete"
                    size={18}
                    onClick={() => deleteRule(r.ruleID)}
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

      {showForm && (
        <EligibilityRuleForm
          rule={showForm}
          onClose={() => setShowForm(null)}
          onSave={loadData}
        />
      )}
    </div>
  );
}