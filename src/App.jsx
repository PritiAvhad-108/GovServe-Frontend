import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
 
import Navbar from "./components/Landing/layout/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Landing/layout/Footer";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgetPassword from "./pages/auth/ForgetPassword";
 
import RoleGuard from "./components/Guards/RoleGuard";
import Citizenroutes from "./routes/Citizenroutes";
import AdminRoutes from "./routes/Adminroutes";
import Supervisorroutes from "./routes/Supervisorroutes";
 
function App() {
  const { isAuthenticated, userRole, loading } = useAuth();
 
  if (loading) return null;
 
  // ✅ FIXED REDIRECT PATHS
  const getRedirectPath = () => {
    if (userRole === "Admin") return "/admin/dashboard";
    if (userRole === "Supervisor") return "/supervisor";
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
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminRoutes />
            </RoleGuard>
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
 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;