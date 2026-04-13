import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminComponents/layout/AdminLayout";

import AdminDashboard from "../pages/AdminPages/dashboard/AdminDashboard";
import DepartmentPage from "../pages/AdminPages/departments/DepartmentPage";
import RolesPage from "../pages/AdminPages/roles/RolesPage";
import SLADaysPage from "../pages/AdminPages/slaDays/SLADaysPage";
import ServicesPage from "../pages/AdminPages/services/ServicesPage";
import ServiceDetailsPage from "../pages/AdminPages/services/ServiceDetailsPage";
import EligibilityPage from "../pages/AdminPages/eligibility/EligibilityRulePage";
import RequiredDocsPage from "../pages/AdminPages/requiredDocs/RequiredDocsPage";
import WorkflowStagePage from "../pages/AdminPages/workflowStages/WorkflowStagePage";
import SLARecordsPage from "../pages/AdminPages/slaRecord/SLARecordsPage";
import UsersPage from "../pages/AdminPages/users/UserPage";
import ServiceReportsPage from "../pages/AdminPages/serviceReports/ServiceReportsPage";
import NotificationsPage from "../pages/AdminPages/notification/NotificationsPage";
import AdminProfilePage from "../pages/AdminPages/profile/AdminProfilePage";
import { useAuth } from "../context/AuthContext";
function AdminRoutes() {
  const { user } = useAuth(); 
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        {/* ✅ DEFAULT ADMIN REDIRECT */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="departments" element={<DepartmentPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="sla-days" element={<SLADaysPage />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="services/:serviceId" element={<ServiceDetailsPage />} />
        <Route path="eligibility-rules" element={<EligibilityPage />} />
        <Route path="required-documents" element={<RequiredDocsPage />} />
        <Route path="workflow-stages" element={<WorkflowStagePage />} />
        <Route path="sla-records" element={<SLARecordsPage />} />
        <Route path="reports" element={<ServiceReportsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<AdminProfilePage />} />
      </Route>
    </Routes>
  );
}

export default AdminRoutes;