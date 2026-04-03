import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import "./dashboard.css";
import {
  Building2,
  Briefcase,
  UsersRound,
  FileText,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

import StatCard from "./StatCard";
import SLADistributionChart from "./SLADistributionChart";
import RecentApplicationsTable from "./RecentApplicationsTable";
import RecentCasesTable from "./RecentCasesTable";
import AdminAttentionPanel from "./AdminAttentionPanel";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    departments: 0,
    services: 0,
    users: 0,
    applications: 0,
    activeSLAs: 0,
    breachedSLAs: 0
  });

  const [applications, setApplications] = useState([]);
  const [cases, setCases] = useState([]);

  const [attention, setAttention] = useState({
    pendingUsers: 0,
    breachedSLAs: 0,
    pendingSlaCases: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        deptRes,
        serviceRes,
        userRes,
        pendingUserRes,
        appRes,
        caseRes,
        onTimeRes,
        breachedRes,
        pendingSlaRes
      ] = await Promise.all([
        api.get("/Department"),
        api.get("/Services"),
        api.get("/User/all"),
        api.get("/User/pending-users"),
        api.get("/Application/all"),
        api.get("/Case/all"),
        api.get("/SLARecords/ontime"),
        api.get("/SLARecords/breached"),
        api.get("/SLARecords/pending-cases") // ✅ SOURCE OF TRUTH
      ]);

      /* KPI stats */
      setStats({
        departments: deptRes.data.length,
        services: serviceRes.data.length,
        users: userRes.data.length,
        applications: appRes.data.length,
        activeSLAs: onTimeRes.data.length,
        breachedSLAs: breachedRes.data.length
      });

      setApplications(appRes.data);
      setCases(caseRes.data);

      /* ✅ Admin Attention counts (NO manual SLA logic) */
      setAttention({
        pendingUsers: pendingUserRes.data.length,
        breachedSLAs: breachedRes.data.length,
        pendingSlaCases: pendingSlaRes.data.length // ✅ FIXED
      });

    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  return (
    <div className="dashboard-container">

      <div className="dashboard-header">
        <div>
          <h2>Admin Dashboard Overview</h2>
          <p>Welcome to GovServe Admin Panel</p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <StatCard title="Total Departments" value={stats.departments} icon={<Building2 />} />
        <StatCard title="Total Services" value={stats.services} icon={<Briefcase />} />
        <StatCard title="Total Users" value={stats.users} icon={<UsersRound />} />
        <StatCard title="Total Applications" value={stats.applications} icon={<FileText />} />
        <StatCard title="Active SLAs" value={stats.activeSLAs} icon={<CheckCircle />} />
        <StatCard title="Breached SLAs" value={stats.breachedSLAs} icon={<AlertTriangle />} />
      </div>

      {/* SLA + ADMIN ATTENTION */}
      <div className="dashboard-row">
        <SLADistributionChart
          onTime={stats.activeSLAs}
          breached={stats.breachedSLAs}
        />

        <AdminAttentionPanel
          pendingUsers={attention.pendingUsers}
          breachedSLAs={attention.breachedSLAs}
          pendingSlaCases={attention.pendingSlaCases}
        />
      </div>

      {/* TABLES */}

       <div className="panel table-panel">
          <RecentCasesTable cases={cases} />
      </div>

      <div className="panel table-panel">
           <RecentApplicationsTable applications={applications} />
      </div>
    </div>
  );
}