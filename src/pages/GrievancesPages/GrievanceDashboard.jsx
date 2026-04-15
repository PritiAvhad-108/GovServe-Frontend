import { useEffect, useState } from "react";
import { FaTasks, FaClock, FaCheckCircle } from "react-icons/fa";

import DashboardCard from "../../components/GrievanceComponents/common/DashboardCard";
import AssignedGrievances from "./AssignedGrievances";

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

  const [pendingCount, setPendingCount] = useState(0);
  const [resolvedCount, setResolvedCount] = useState(0);

  const [totalAppeals, setTotalAppeals] = useState(0);
  const [pendingAppeals, setPendingAppeals] = useState(0);
  const [resolvedAppeals, setResolvedAppeals] = useState(0);

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

      {/* ✅ Grievance Cards */}
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

      {/* ✅ Appeal Cards */}
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

      {/* ✅ Officer Grievance List */}
      <AssignedGrievances grievances={grievances} />
    </div>
  );
};

export default GrievanceDashboard;