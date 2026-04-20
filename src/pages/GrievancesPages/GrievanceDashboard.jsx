import { useEffect, useState } from "react";
import { FaTasks, FaClock, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/GrievanceComponents/common/DashboardCard";

import "../../styles/GrievanceStyles/dashboard.css";

import {
  getAllGrievances,
  getPendingGrievanceCount,
  getResolvedGrievanceCount,
  getSubmittedAppeals,
  getPendingAppealCount,
  getResolvedAppealCount,
} from "../../api/GrievanceApi";

const GrievanceDashboard = () => {
  const [grievances, setGrievances] = useState([]);

  const [dashboardQueues, setDashboardQueues] = useState([]);


  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  const [totalAppeals, setTotalAppeals] = useState(0);
  const [pendingAppeals, setPendingAppeals] = useState(0);
  const [resolvedAppeals, setResolvedAppeals] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        grievancesRes,
        pendingRes,
        resolvedRes,
        appealsRes,
        pendingAppealsRes,
        resolvedAppealsRes,
      ] = await Promise.all([
        getAllGrievances(),
        getPendingGrievanceCount(),
        getResolvedGrievanceCount(),
        getSubmittedAppeals(),
        getPendingAppealCount(),
        getResolvedAppealCount(),
      ]);



      setGrievances(grievancesRes?.data || []);

      const submittedGrievances = (grievancesRes?.data || [])
  .filter(g => g.status === "Submitted")
  .map(g => ({
    type: "Grievance",
    id: g.grievanceId,
    applicationId: g.applicationID,
    reason: g.reason,
    filedDate: g.filedDate,
    refId: g.grievanceId,
    raw: g
  }));

const submittedAppeals = (appealsRes?.data || [])
  .map(a => ({
    type: "Appeal",
    id: a.appealID,
    applicationId: a.applicationID,
    reason: a.reason,
    filedDate: a.filedDate,
    refId: a.appealID,
    raw: a
  }));

setDashboardQueues([
  ...submittedGrievances,
  ...submittedAppeals
]);

      setPendingCount(
        pendingRes?.data?.pendingGrievanceCount || 0
      );
      setResolvedCount(
        resolvedRes?.data?.resolvedGrievanceCount || 0
      );

      setTotalAppeals(appealsRes?.data?.length || 0);
      setPendingAppeals(
        pendingAppealsRes?.data?.pendingAppeals || 0
      );
      setResolvedAppeals(
        resolvedAppealsRes?.data?.resolvedAppeals || 0
      );

    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Grievance Officer Dashboard</h2>
      </div>

      {/*  Grievance Cards */}
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Grievances"
          count={grievances.length}
          icon={FaTasks}
        />

        <DashboardCard
          title="Pending Grievances"
          count={pendingCount}
          icon={FaClock}
        />

        <DashboardCard
          title="Resolved Grievances"
          count={resolvedCount}
          icon={FaCheckCircle}
        />
      </div>

      {/*  Appeal Cards */}
      <div className="dashboard-cards">
        <DashboardCard
          title="Total Appeals"
          count={totalAppeals}
          icon={FaTasks}
        />

        <DashboardCard
          title="Pending Appeals"
          count={pendingAppeals}
          icon={FaClock}
        />

        <DashboardCard
          title="Resolved Appeals"
          count={resolvedAppeals}
          icon={FaCheckCircle}
        />
      </div>

      <h3 style={{ marginTop: "20px" }}>
  Pending Actions (Grievances & Appeals)
</h3>

<table className="grievance-table">
  <thead>
    <tr>
      <th>Type</th>
      <th>Reference ID</th>
      <th>Application ID</th>
      <th>Reason</th>
      <th>Filed Date</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
    {dashboardQueues.length === 0 ? (
      <tr>
        <td colSpan="6" style={{ textAlign: "center" }}>
          No pending items
        </td>
      </tr>
    ) : (
      dashboardQueues.map((item, index) => (
        <tr key={index}>
          <td>
            <span
              style={{
                fontWeight: "bold",
                color: item.type === "Grievance" ? "#1d4ed8" : "#7c2d12"
              }}
            >
              {item.type}
            </span>
          </td>

          <td>{item.refId}</td>
          <td>{item.applicationId}</td>
          <td>{item.reason}</td>
          <td>
            {item.filedDate
              ? new Date(item.filedDate).toLocaleDateString()
              : "-"}
          </td>

          <td>
            <button
              className="view-btn"
              onClick={() =>
                navigate(
                  item.type === "Grievance"
                    ? `/grievances/view/${item.refId}`
                    : `/grievances/appeal-view/${item.refId}`,
                  { state: item.raw }
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
  );
};

export default GrievanceDashboard;