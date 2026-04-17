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

  /*  LOAD USERS */
  const loadUsers = async () => {
    try {
      const res = pendingOnly
        ? await api.get("/User/pending-users")
        : await api.get("/User/all");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadUsers();
  }, [pendingOnly]);

  /*  ACTIONS */
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

  /*  FILTER */
  const filtered = users.filter(u =>
    [u.fullName, u.email, u.roleName]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /*  PAGINATION */
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentData = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className="users-container">
      <ToastContainer />

      {/*  HEADER */}
      <div className="users-header">
        <div>
          <h2 className="page-title">User Management</h2>
          <p className="page-subtitle">
            Approve, reject, or remove users from the system
          </p>
        </div>

        <div className="users-count-card">
          <div className="icon-bg">
            <UsersRound size={28} color="#1e3a8a" />
          </div>
          <div>
            <p>Total Users</p>
            <h3>{users.length}</h3>
          </div>
        </div>
      </div>

      {/*  FILTER ROW */}
      <div className="filter-row">
        <input
          className="form-control"
          placeholder="Search by name, email or role..."
          value={search}
          onChange={e => setSearch(e.target.value)}
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

      {/*  TABLE */}
      <div className="table-wrapper">
        <table className="table-white">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Department</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-msg">
                  No users found.
                </td>
              </tr>
            ) : (
              currentData.map(user => (
                <tr key={user.userId}>
                  <td>{user.fullName}</td>
                  <td>{user.email}</td>
                  <td>{user.roleName}</td>
                  <td>{user.departmentName || "-"}</td>
                  <td>
                    <span className={`badge ${
                      user.status === "Approved"
                        ? "bg-success"
                        : user.status === "Pending"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}>
                      {user.status}
                    </span>
                  </td>

                  {/*  ACTIONS */}
                  <td className="actions-col">
                    {user.status === "Pending" && (
                      <>
                        <Check
                          className="icon-approve"
                          title="Approve"
                          onClick={() => approveUser(user.userId)}
                        />
                        <X
                          className="icon-reject"
                          title="Reject"
                          onClick={() => rejectUser(user.userId)}
                        />
                      </>
                    )}
                    <Trash2
                      className="icon-delete"
                      title="Delete"
                      onClick={() => deleteUser(user.userId)}
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
    </div>
  );
}