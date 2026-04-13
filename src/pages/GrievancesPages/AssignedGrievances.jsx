import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGrievances } from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/dashboard.css";
import "../../styles/GrievanceStyles/table.css";

const AssignedGrievances = ({ grievances: dashboardGrievances }) => {
  const [grievances, setGrievances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (dashboardGrievances && dashboardGrievances.length > 0) {
      setGrievances(dashboardGrievances);
    } else {
      fetchGrievances();
    }
  }, [dashboardGrievances]);

  const fetchGrievances = async () => {
    try {
      const response = await getAllGrievances();
      setGrievances(response.data || []);
    } catch (error) {
      console.error("Error fetching grievances", error);
      setGrievances([]);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Grievance List</h2>

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
            {grievances.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No grievances found
                </td>
              </tr>
            ) : (
              grievances.map((g) => (
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
      </div>
    </div>
  );
};

export default AssignedGrievances;