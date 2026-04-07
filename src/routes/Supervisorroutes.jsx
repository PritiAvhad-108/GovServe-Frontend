import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout
import SupervisorLayout from "../components/SupervisorComponents/layout/SupervisorLayout";

// Pages
import SupervisorDashboard from "../pages/Supervisor/Dashboard/SupervisorDashboard";
import Cases from "../pages/Supervisor/Cases/Cases";
import CaseDetails from "../pages/Supervisor/Cases/CaseDetails";
import Escalations from "../pages/Supervisor/Escalations/Escalations";
import Notifications from "../pages/Supervisor/Notifications/Notifications";
import Officers from "../pages/Supervisor/Officers/Officers";
import Reports from "../pages/Supervisor/Reports/Reports";

const SupervisorRoutes = () => {
  return (
    <Routes>
      <Route path="/supervisor" element={<SupervisorLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<SupervisorDashboard />} />
        <Route path="cases" element={<Cases />} />
        <Route path="case-details/:caseId" element={<CaseDetails />} />
        <Route path="escalations" element={<Escalations />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="officers" element={<Officers />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
};

export default SupervisorRoutes;
