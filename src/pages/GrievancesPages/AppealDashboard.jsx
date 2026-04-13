import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getSubmittedAppeals } from "../../api/GrievanceApi";

import "../../styles/GrievanceStyles/dashboard.css";
import "../../styles/GrievanceStyles/appealDashboard.css";
import "../../styles/GrievanceStyles/table.css";

const AppealDashboard = () => {
  const [appeals, setAppeals] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppeals();
  }, []);

  const loadAppeals = async () => {
    try {
      const response = await getSubmittedAppeals();
      setAppeals(response.data || []);
    } catch (error) {
      console.error("Error fetching appeals", error);
      setAppeals([]);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Appeal List</h2>

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
            {appeals.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No appeals found
                </td>
              </tr>
            ) : (
              appeals.map((a) => (
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
                  <td>{a.status}</td>
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
      </div>
    </div>
  );
};

export default AppealDashboard;