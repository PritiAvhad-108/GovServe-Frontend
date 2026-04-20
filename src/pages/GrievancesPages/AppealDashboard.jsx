import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllAppeals } from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/dashboard.css";
import "../../styles/GrievanceStyles/appealDashboard.css";
import "../../styles/GrievanceStyles/table.css";


// Backend enum 
const appealStatusMap = {
  0: "Submitted",
  1: "Approved",
  2: "Rejected",
};


const AppealDashboard = () => {
  const [appeals, setAppeals] = useState([]);

  // Filter states
const [searchText, setSearchText] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

// Pagination states
const [currentPage, setCurrentPage] = useState(1);
const rowsPerPage = 5;


  const navigate = useNavigate();

  useEffect(() => {
    loadAppeals();
  }, []);

  const loadAppeals = async () => {
    try {
      const response = await getAllAppeals();
      setAppeals(response.data || []);
    } catch (error) {
      console.error("Error fetching appeals", error);
      setAppeals([]);
    }
  };

  const filteredAppeals = appeals
 
.filter(a =>
  statusFilter === "All"
    ? true
    : getStatusText(a.status) === statusFilter
)

  .filter(a => {
    if (!fromDate && !toDate) return true;
    const filed = new Date(a.filedDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) return filed >= from && filed <= to;
    if (from) return filed >= from;
    if (to) return filed <= to;
    return true;
  })
  .filter(a =>
    searchText.trim() === ""
      ? true
      : a.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
        String(a.appealID).includes(searchText) ||
        String(a.applicationID).includes(searchText)
  );

  const totalPages = Math.ceil(filteredAppeals.length / rowsPerPage);
const startIndex = (currentPage - 1) * rowsPerPage;
const paginatedAppeals = filteredAppeals.slice(
  startIndex,
  startIndex + rowsPerPage
);

  useEffect(() => {
  setCurrentPage(1);
}, [searchText, statusFilter, fromDate, toDate]);

  return (
    <div className="dashboard-container">
      <h2>Appeal List</h2>

      <div className="filter-bar" style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
  <input
    type="text"
    placeholder="Search by ID or Reason"
    value={searchText}
    onChange={(e) => setSearchText(e.target.value)}
  />

  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="All">All</option>
    <option value="Submitted">Submitted</option>
    <option value="Approved">Approved</option>
    <option value="Rejected">Rejected</option>
  </select>

  <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
  <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
</div>


      <div className="table-wrapper">
        <table className="grievance-table">
          <thead>
            <tr>
              <th>Appeal ID</th>
              <th>Citizen</th>
              <th>Application ID</th>
              <th>Reason</th>
              <th>Description</th>
              <th>Filed Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppeals.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No appeals found
                </td>
              </tr>
            ) : (
              paginatedAppeals.map((a) => (
                <tr key={a.appealID}>
                  <td>{a.appealID}</td>
                  <td>{a.userId}</td>
                  <td>{a.applicationID}</td>
                  <td className="reason-col">{a.reason}</td>
                  <td className="description-col">{a.description}</td>
                  <td>
                    {a.filedDate
                      ? new Date(a.filedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
  {(() => {
    if (a.status === 0 || a.status === "0") return "Submitted";
    if (a.status === 1 || a.status === "1") return "Approved";
    if (a.status === 2 || a.status === "2") return "Rejected";
    if (typeof a.status === "string") return a.status;
    return "-";
  })()}
</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/grievances/appeal-view/${a.appealID}`,
                          { state: a }
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="pagination-container">
  <button
    className="pagination-btn"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    Previous
  </button>

  <span className="pagination-info">
    Page <b>{currentPage}</b> of <b>{totalPages}</b>
  </span>

  <button
    className="pagination-btn"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next
  </button>
</div>
      </div>
    </div>
  );
};

export default AppealDashboard;