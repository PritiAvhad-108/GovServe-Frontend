import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./roles.css";
import { ToastContainer, toast } from "react-toastify";
import { Plus, Pencil, Trash2, Shield } from "lucide-react";
import RoleForm from "./RoleForm";
import Pagination from "../../../components/AdminComponents/common/Pagination";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  //  LOAD DATA
  const loadData = async () => {
    try {
      const res = await api.get("/Roles");
      setRoles(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to load roles");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  //  SEARCH FILTER
  useEffect(() => {
    const data = roles.filter((r) =>
      r.roleName.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(data);
    setCurrentPage(1);
  }, [search, roles]);

  //  PAGINATION
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="roles-container">
      <ToastContainer position="top-center" />

      {/* HEADER */}
      <div className="roles-header">
        <div>
          <h2 className="page-title">Role Management</h2>
          <p className="page-subtitle">
            Manage user roles and access levels
          </p>
        </div>

        <div className="roles-stats-card">
          <div className="stats-icon">
            <Shield size={28} color="#1e3a8a" />
          </div>
          <div>
            <p className="stats-label">Total Roles</p>
            <h3 className="stats-value">{roles.length}</h3>
          </div>
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search roles..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary create-btn"
          onClick={() =>
            setShowForm({
              roleID: null,
              roleName: "",
            })
          }
        >
          <Plus size={18} /> Add Role
        </button>
      </div>

      {/* TABLE */}
      <table className="table-white">
        <thead>
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            <th className="actions-col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentData.length === 0 ? (
            <tr>
              <td colSpan="3" className="empty-msg">
                No roles found matching your search.
              </td>
            </tr>
          ) : (
            currentData.map((role) => (
              <tr key={role.roleID}>
                <td>{role.roleID}</td>
                <td>{role.roleName}</td>
                <td className="actions-col">
                  <Pencil
                    size={18}
                    className="icon-edit"
                    title="Edit Role"
                    onClick={() => setShowForm(role)}
                  />
                  <Trash2
                    size={18}
                    className="icon-delete"
                    title="Delete Role"
                    onClick={() => {
                      if (window.confirm("Delete this role?")) {
                        api
                          .delete(`/Roles/${role.roleID}`)
                          .then(() => {
                            toast.success("Role deleted");
                            loadData();
                          });
                      }
                    }}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* MODAL */}
      {showForm && (
        <RoleForm
          role={showForm}
          onClose={() => setShowForm(null)}
          onSave={loadData}
        />
      )}
    </div>
  );
}