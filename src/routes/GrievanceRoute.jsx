import { Routes, Route } from "react-router-dom";
import GrievanceLayout from "../components/GrievanceComponents/layout/GrievanceLayout";

/* ✅ Grievance Pages */
import GrievanceDashboard from "../pages/GrievancesPages/GrievanceDashboard";
import AssignedGrievances from "../pages/GrievancesPages/AssignedGrievances";
import GrievanceDetails from "../pages/GrievancesPages/GrievanceDetails";

/* ✅ Appeal Pages */
import AppealDashboard from "../pages/GrievancesPages/AppealDashboard";
import AppealDetailsCard from "../pages/GrievancesPages/AppealDetailsCard";
import { useAuth } from "../context/AuthContext";

import Profile from "../pages/Profile";

const GrievanceRoute = () => {
  const { user } = useAuth();
  return (
    <Routes>
      {/* ✅ Layout wrapper (ONLY ONCE) */}
      <Route element={<GrievanceLayout />}>

        {/* ✅ Default dashboard */}
        <Route index element={<GrievanceDashboard />} />
        <Route path="dashboard" element={<GrievanceDashboard />} />

        {/* ✅ Grievance */}
        <Route path="assigned" element={<AssignedGrievances />} />
        <Route path="view/:id" element={<GrievanceDetails />} />

        {/* ✅ Appeals */}
        <Route path="appeals" element={<AppealDashboard />} />
        <Route path="appeal-view/:id" element={<AppealDetailsCard />} />

        {/* ✅ Profile */}
        <Route path="profile" element={<Profile />} />

      </Route>
    </Routes>
  );
};

export default GrievanceRoute;
