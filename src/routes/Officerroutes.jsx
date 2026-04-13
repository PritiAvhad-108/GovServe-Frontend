import { Routes, Route, Navigate } from "react-router-dom";
import OfficerLayout from "../components/OfficerComponents/layout/OfficerLayout";
import OfficerDashboard from "../pages/OfficerPages/dashboard/OfficerDashboard";
import AssignedCasesPage from "../pages/OfficerPages/assignedCases/AssignedCasesPage";
import CaseDetailsPage from "../pages/OfficerPages/caseDetails/CaseDetailsPage";
import CasesByStatusPage from "../pages/OfficerPages/casesByStatus/CasesByStatusPage";
import NotificationBell from "../pages/OfficerPages/notifications/OfficerNotifications";
import SlaWorkflowPage from "../pages/OfficerPages/SlaWorkflowPage/SlaWorkflowPage";
// import OfficerProfile from "../pages/OfficerPages/OfficerProfile/OfficerProfile";

// ✅ 1. Import your dedicated Pending Cases Page
import PendingCasesPage from "../pages/OfficerPages/PendingCasesPage/PendingCasesPage";

function OfficerRoutes() {
  return (
    <Routes>
      <Route element={<OfficerLayout />}>
        <Route index element={<Navigate to="dashboard" />} />
        <Route path="dashboard" element={<OfficerDashboard />} />
        <Route path="assigned-cases" element={<AssignedCasesPage />} />
        <Route path="case-details/:id" element={<CaseDetailsPage />} />
        <Route path="application-details/:id" element={<CaseDetailsPage />} />
        
        <Route path="approved-cases" element={<CasesByStatusPage statusTitle="Approved" />} />
        <Route path="rejected-cases" element={<CasesByStatusPage statusTitle="Rejected" />} />
        <Route path="resubmitted-cases" element={<CasesByStatusPage statusTitle="Resubmitted" />} />
        
        <Route path="approved" element={<CasesByStatusPage statusTitle="Approved" />} />
        <Route path="rejected" element={<CasesByStatusPage statusTitle="Rejected" />} />
        <Route path="resubmitted" element={<CasesByStatusPage statusTitle="Resubmitted" />} />

        <Route path="notifications" element={<NotificationBell />} />
        <Route path="sla-workflow" element={<SlaWorkflowPage />} />

        {/* ✅ 2. Point the pending-review URL to your dedicated page */}
        <Route path="pending-review" element={<PendingCasesPage />} />

        {/* <Route path="profile" element={<OfficerProfile />} /> */}
      </Route>
    </Routes>
  );
}

export default OfficerRoutes;