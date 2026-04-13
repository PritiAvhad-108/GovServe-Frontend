import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import Profile from "../pages/Profile";
// Pages
import Dashboard from "../pages/CitizenPages/Dashboard";
import ApplyService from "../pages/CitizenPages/ApplyService";
import ServiceDetails from "../pages/CitizenPages/ServiceDetails";
import ApplicationForm from "../pages/CitizenPages/ApplicationForm";
import Grievance from "../pages/CitizenPages/Grievance";
import NotificationPage from "../pages/CitizenPages/NotificationPage";
import MyApplications from "../pages/CitizenPages/MyApplications";
import ApplicationDetails from "../pages/CitizenPages/ApplicationDetails";
import MyDocuments from "../pages/CitizenPages/MyDocuments";

// Components
import Navbar from "../components/CitizenComponent/Navbar";
import Sidebar from "../components/CitizenComponent/Sidebar";

function Citizenroutes() {
  const { user } = useAuth(); 
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="app-container">
      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="main-layout" style={{ display: "flex", flex: 1 }}>
        <Sidebar isOpen={isOpen} />

        <div className="content-area" style={{ flex: 1, overflowY: "auto", padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
      
            <Route path="profile" element={<Profile />} />
            <Route path="apply" element={<ApplyService />} />
            <Route path="service-details/:id" element={<ServiceDetails />} />
            <Route path="apply-form/:id" element={<ApplicationForm />} />
            <Route 
              path="my-applications" 
              element={<MyApplications userId={user?.userId} />} 
            />
            
            <Route path="application-details/:id" element={<ApplicationDetails />} />
            <Route path="my-documents" element={<MyDocuments />} />
            <Route path="grievance" element={<Grievance />} />
            
            <Route 
              path="notifications" 
              element={<NotificationPage userId={user?.userId} />} 
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Citizenroutes;