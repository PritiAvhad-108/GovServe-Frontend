import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGrievances } from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/dashboard.css";
import "../../styles/GrievanceStyles/table.css";

const AssignedGrievances = ({ grievances: dashboardGrievances }) => {
  const [grievances, setGrievances] = useState([]);
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
    if (dashboardGrievances && dashboardGrievances.length > 0) {
      setGrievances(dashboardGrievances);
    } else {
      fetchGrievances();
    }
  }, [dashboardGrievances]);

  useEffect(() => {
  setCurrentPage(1);
}, [searchText, statusFilter, fromDate, toDate]);

  const fetchGrievances = async () => {
    try {
      const response = await getAllGrievances();
      setGrievances(response.data || []);
    } catch (error) {
      console.error("Error fetching grievances", error);
      setGrievances([]);
    }
  };

const filteredGrievances = grievances
  .filter((g) =>
    statusFilter === "All" ? true : g.status === statusFilter
  )
  .filter((g) => {
    if (!fromDate && !toDate) return true;
    const filed = new Date(g.filedDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    if (from && to) return filed >= from && filed <= to;
    if (from) return filed >= from;
    if (to) return filed <= to;
    return true;
  })
  .filter((g) =>
    searchText.trim() === ""
      ? true
      : g.reason?.toLowerCase().includes(searchText.toLowerCase()) ||
        String(g.grievanceId).includes(searchText) ||
        String(g.applicationID).includes(searchText)
  );

  const totalPages = Math.ceil(filteredGrievances.length / rowsPerPage);
const startIndex = (currentPage - 1) * rowsPerPage;
const paginatedGrievances = filteredGrievances.slice(
  startIndex,
  startIndex + rowsPerPage
);


  return (
    <div className="dashboard-container">
      <h2>Grievance List</h2>

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
    <option value="Pending">Pending</option>
    <option value="Resolved">Resolved</option>
    <option value="Rejected">Rejected</option>
  </select>

  <input
    type="date"
    value={fromDate}
    onChange={(e) => setFromDate(e.target.value)}
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) => setToDate(e.target.value)}
  />
</div>

      <div className="table-wrapper">
        <table className="grievance-table">
          <thead>
            <tr>
              <th>Grievance ID</th>
              <th>Citizen ID</th>
              <th>Application ID</th>
              <th>Reason</th>
              <th>Description</th>
              <th>Filed Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredGrievances.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No grievances found
                </td>
              </tr>
            ) : (
             paginatedGrievances.map((g) => (
                <tr key={g.grievanceId}>
                  <td>{g.grievanceId}</td>
                  <td>{g.userId}</td>
                  <td>{g.applicationID}</td>
                  <td className="reason-col">{g.reason}</td>
                  <td className="description-col">{g.description}</td>
                  <td>
                    {g.filedDate
                      ? new Date(g.filedDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{g.status}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/grievances/view/${g.grievanceId}`,
                          { state: g }
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

export default AssignedGrievances;