


import { Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminComponents/layout/AdminLayout";
import DepartmentPage from "./pages/AdminPages/departments/DepartmentPage";
import RolesPage from "./pages/AdminPages/roles/RolesPage";
import SLADaysPage from "./pages/AdminPages/slaDays/SLADaysPage";
import ServicesPage from "./pages/AdminPages/services/ServicesPage";
import ServiceDetailsPage from "./pages/AdminPages/services/ServiceDetailsPage";
import EligibilityPage from "./pages/AdminPages/eligibility/EligibilityRulePage";
import RequiredDocsPage from "./pages/AdminPages/requiredDocs/RequiredDocsPage";
import WorkflowStagePage from "./pages/AdminPages/workflowStages/WorkflowStagePage";
import SLARecordsPage from "./pages/AdminPages/slaRecord/SLARecordsPage";
import UsersPage from "./pages/AdminPages/users/UserPage";
import ServiceReportsPage from "./pages/AdminPages/serviceReports/ServiceReportsPage";
import AdminDashboard from "./pages/AdminPages/dashboard/AdminDashboard";


function App() {
  return (
    <AdminLayout>
      <Routes>

        
          {/* ✅ Default Redirect
          <Route path="/" element={<Navigate to="/admin/dashboard" />} /> */}
          {/* ✅ Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        {/* <Route path="*" element={<Navigate to="/admin/dashboard" />}/> */}
        <Route path="/admin/departments" element={<DepartmentPage />} />
        <Route path="/admin/roles" element={<RolesPage/>} />
        <Route path="/admin/sla-days" element={<SLADaysPage />} />
        <Route path="/admin/services" element={<ServicesPage />} />
        <Route path="/admin/services/:serviceId"element={<ServiceDetailsPage />}/>
        <Route path="/admin/eligibility-rules" element={<EligibilityPage />} />
        <Route path="/admin/required-documents" element={<RequiredDocsPage />} />
        <Route path="/admin/workflow-stages"element={<WorkflowStagePage />}/>  
       <Route path="/admin/sla-records"element={<SLARecordsPage />}/>
       <Route path="/admin/reports" element={<ServiceReportsPage />} />
       <Route path="/admin/users" element={<UsersPage />} /> 

      </Routes>
    </AdminLayout>
  );
}

export default App;
