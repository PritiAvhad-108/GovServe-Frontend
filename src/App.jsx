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
import AdminRoutes from "./routes/Adminroutes";
import Supervisorroutes from "./routes/Supervisorroutes";

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; 

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/citizen" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/citizen" />} />

        {/* Protected Citizen Routes */}
        <Route
          path="/citizen/*"
          element={
            <RoleGuard allowedRoles={["Citizen"]}>
              <Citizenroutes />
            </RoleGuard>
          }
        />

         {/* Protected Admin Routes */}
         <Route path="/admin/*"
          element={
            <RoleGuard allowedRoles={["Admin"]}>
              <AdminRoutes />
            </RoleGuard>
          }
           />


             {/* Protected Citizen Routes */}
        <Route
          path="/supervisor/*"
          element={
            <RoleGuard allowedRoles={["Supervisor"]}>
              <Supervisorroutes />
            </RoleGuard>
          }
        />
 
          

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
 
export default App;
