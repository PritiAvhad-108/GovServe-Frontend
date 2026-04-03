import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./users.css";
import { Check, X, Trash2, UsersRound } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import Pagination from "../../../components/AdminComponents/common/Pagination";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [pendingOnly, setPendingOnly] = useState(false);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const loadUsers = async () => {
    const res = pendingOnly
      ? await api.get("/User/pending-users")
      : await api.get("/User/all");

    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, [pendingOnly]);

  const approveUser = async (id) => {
    await api.put(`/User/approve/${id}`);
    toast.success("User approved");
    loadUsers();
  };

  const rejectUser = async (id) => {
    await api.put(`/User/reject/${id}`);
    toast.success("User rejected");
    loadUsers();
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await api.delete(`/User/${id}`);
    toast.success("User deleted");
    loadUsers();
  };

  const filtered = users.filter(
    u =>
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.roleName.toLowerCase().includes(search.toLowerCase())
  );

  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="users-container">
      <ToastContainer />

      {/* HEADER */}
      <div className="users-header">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">
            Approve, reject, or remove users from the system
          </p>
        </div>

        {/* ✅ UPDATED LUCIDE ICON */}
        <div className="users-count-card">
         <div className="icon-bg">
             <UsersRound size={28} color="#2563eb" />
         </div>
          <div>
             <p>Total Users</p>
            <h3>{users.length}</h3>
         </div>
        </div>
        </div>

      {/* FILTER */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="form-control"
          value={pendingOnly ? "Pending" : "All"}
          onChange={(e) => setPendingOnly(e.target.value === "Pending")}
        >
          <option value="All">All Users</option>
          <option value="Pending">Pending Users</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="table table-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map(user => (
              <tr key={user.userId}>
                <td>{user.fullName}</td>
                <td>{user.email}</td>
                <td>{user.roleName}</td>
                <td>{user.departmentName || "-"}</td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "Approved"
                        ? "bg-success"
                        : user.status === "Pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="actions-col">
                  {user.status === "Pending" && (
                    <>
                      <Check
                        className="icon-approve"
                        onClick={() => approveUser(user.userId)}
                      />
                      <X
                        className="icon-reject"
                        onClick={() => rejectUser(user.userId)}
                      />
                    </>
                  )}
                  <Trash2
                    className="icon-delete"
                    onClick={() => deleteUser(user.userId)}
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
    </div>
  );
}