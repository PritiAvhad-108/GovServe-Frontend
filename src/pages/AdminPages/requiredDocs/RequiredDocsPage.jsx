import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./requiredDocs.css";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";
import RequiredDocForm from "./RequiredDocForm";

export default function RequiredDocsPage() {
  const [docs, setDocs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadData = async () => {
    try {
      const res = await api.get("/RequiredDocuments");
      setDocs(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load required documents");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let data = docs;

    if (search.trim()) {
      data = data.filter(
        d =>
          d.documentName.toLowerCase().includes(search.toLowerCase()) ||
          d.serviceName.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);
    setCurrentPage(1);
  }, [search, docs]);

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const deleteDoc = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    await api.delete(`/RequiredDocuments/${id}`);
    toast.success("Document deleted");
    loadData();
  };

  return (
    <div className="reqdocs-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="reqdocs-header">
        <div>
          <h2 className="page-title">Required Documents</h2>
          <p className="page-subtitle">Manage documents per service</p>
        </div>

        <div className="reqdocs-stats-card">
          <div className="stats-icon">
            <FileText size={28} color="#2563eb" />
          </div>
          <div>
            <p>Total</p>
            <h3>{docs.length}</h3>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search service or document..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button className="btn btn-primary create-btn" onClick={() => setShowForm({})}>
          <Plus size={16} color="white" /> Add Document
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service</th>
              <th>Document</th>
              <th>Mandatory</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((d) => (
              <tr key={d.documentID}>
                <td>{d.documentID}</td>
                <td>{d.serviceName}</td>
                <td>{d.documentName}</td>

                {/* ✅ CORRECT string handling */}
                <td>
                  <span className={`badge ${d.mandatory === "Yes" ? "bg-primary" : "bg-secondary"}`}>
                    {d.mandatory}
                  </span>
                </td>

                <td className="actions-col">
                  <Pencil size={18} className="icon-edit" onClick={() => setShowForm(d)} />
                  <Trash2 size={18} className="icon-delete" onClick={() => deleteDoc(d.documentID)} />
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

      {/* MODAL */}
      {showForm && (
        <RequiredDocForm
          doc={showForm}
          onClose={() => setShowForm(null)}
          onSave={loadData}
        />
      )}
    </div>
  );
}