import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
 
import Navbar from "./components/Landing/layout/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Landing/layout/Footer";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgetPassword from "./pages/auth/ForgetPassword";
 
import AuthGuard from "./components/Guards/AuthGaurd";
import RoleGuard from "./components/Guards/RoleGuard";
import Citizenroutes from "./routes/Citizenroutes";
import AdminRoutes from "./routes/Adminroutes";
import Supervisorroutes from "./routes/Supervisorroutes";
import OfficerRoutes from "./routes/Officerroutes";
import GrievanceRoute from "./routes/GrievanceRoute";


 
function App() {
  const {userRole, loading } = useAuth();
 
  if (loading) return null;
 
  const getRedirectPath = () => {
    if (userRole === "Admin") return "/admin/dashboard";
    if (userRole === "Supervisor") return "/supervisor";
    if (userRole === "Officer") return "/officer";
    if (userRole === "Grievance Officer") return "/grievances";
    return "/citizen";
  };
 
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />
 
        {/* AUTH */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
 
        <Route path="/forget-password" element={<ForgetPassword />} />
 
        {/* CITIZEN */}
        <Route
          path="/citizen/*"
          element={
            <RoleGuard allowedRoles={["Citizen"]}>
              <Citizenroutes />
            </RoleGuard>
          }
        />
 
        {/* ADMIN */}
       
        <Route
          path="/admin/*"
          element={
             <AuthGuard>
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminRoutes />
            </RoleGuard>
            </AuthGuard>
          }
        />
 
        {/* SUPERVISOR */}
        <Route
          path="/supervisor/*"
          element={
            <RoleGuard allowedRoles={["Supervisor"]}>
              <Supervisorroutes />
            </RoleGuard>
          }
        />
         {/* OFFICER */}
        <Route
          path="/officer/*"
          element={
            <RoleGuard allowedRoles={["Officer"]}>
              <OfficerRoutes />
            </RoleGuard>
          }
        />

         {/* OFFICER */}
        <Route
          path="/grievances/*"
          element={
            <RoleGuard allowedRoles={["Grievance Officer"]}>
              <GrievanceRoute />
            </RoleGuard>
          }
        />
 
 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
