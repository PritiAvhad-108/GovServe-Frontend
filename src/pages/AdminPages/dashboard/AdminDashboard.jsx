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
  //derieved from API data - counts for each KPI stat (departments, services, users, applications, activeSLAs, breachedSLAs)
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

  /*  SOURCE OF TRUTH FOR PIE */
  const [slaRecords, setSlaRecords] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);  //runs once when  page loads

  const loadDashboardData = async () => {
    try {
      const [
        deptRes,
        serviceRes,
        userRes,
        pendingUserRes,
        appRes,
        caseRes,
        slaRecordsRes,
        pendingSlaRes
      ] = await Promise.all([ //batch all API calls together for faster load
        api.get("/Department"),
        api.get("/Services"),
        api.get("/User/all"),
        api.get("/User/pending-users"),
        api.get("/Application/all"),
        api.get("/Case/all"),
        api.get("/SLARecords"),              
        api.get("/SLARecords/pending-cases")
      ]);

      /*  KPI stats calculate counts */
      setStats({
        departments: deptRes.data.length,
        services: serviceRes.data.length,
        users: userRes.data.length,
        applications: appRes.data.length,
        activeSLAs: slaRecordsRes.data.filter(
          r => r.status === "OnTime"
        ).length,
        breachedSLAs: slaRecordsRes.data.filter(
          r => r.status === "Breached"
        ).length
      });

      setApplications(appRes.data);
      setCases(caseRes.data);
      setSlaRecords(slaRecordsRes.data);

      /*  Admin Attention */
      setAttention({
        pendingUsers: pendingUserRes.data.length,
        breachedSLAs: slaRecordsRes.data.filter(
          r => r.status === "Breached"
        ).length,
        pendingSlaCases: pendingSlaRes.data.length
      });

    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  /*  SAME PIE LOGIC AS SLA RECORDS PAGE */
  const onTimeCount = slaRecords.filter(
    r => r.status === "OnTime"
  ).length;

  const breachedCount = slaRecords.filter(
    r => r.status === "Breached"
  ).length;

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
          onTime={onTimeCount}
          breached={breachedCount}
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
      <br/>
      <div className="panel table-panel">
        <RecentApplicationsTable applications={applications} />
      </div>
    </div>
  );
}