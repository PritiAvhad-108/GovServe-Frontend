import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Navbar from "./components/Landing/layout/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Landing/layout/Footer";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage"; 
import RoleGuard from "./components/Guards/RoleGuard";
import Citizenroutes from "./routes/Citizenroutes";
import Adminroutes from "./routes/Adminroutes"; 
import Supervisorroutes from "./routes/Supervisorroutes"; 
import ForgetPassword from "./pages/auth/ForgetPassword";

function App() {
  const { isAuthenticated, userRole, loading } = useAuth(); 

  if (loading) return null; 

  const getRedirectPath = () => {
    if (userRole === "Admin") return "/admin/dashboard";
    if (userRole === "Supervisor") return "/supervisor";
    return "/citizen";
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={getRedirectPath()} />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to={getRedirectPath()} />} />
        <Route path="/forget-password" element={<ForgetPassword />} />

        {/* Citizen Routes */}
        <Route
          path="/citizen/*"
          element={
            <RoleGuard allowedRoles={["Citizen"]}>
              <Citizenroutes />
            </RoleGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <Adminroutes />
            </RoleGuard>
          }
        />

        {/* Supervisor Routes */}
        <Route
          path="/supervisor/*"
          element={
            <RoleGuard allowedRoles={["Supervisor"]}>
              <Supervisorroutes />
            </RoleGuard>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;