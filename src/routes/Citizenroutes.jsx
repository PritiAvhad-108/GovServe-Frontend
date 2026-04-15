import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import Profile from "../pages/Profile";

import Dashboard from "../pages/CitizenPages/Dashboard";
import ApplyService from "../pages/CitizenPages/ApplyService";
import ServiceDetails from "../pages/CitizenPages/ServiceDetails";
import ApplicationForm from "../pages/CitizenPages/ApplicationForm";
import Grievance from "../pages/CitizenPages/Grievance";
import NotificationPage from "../pages/CitizenPages/NotificationPage";
import MyApplications from "../pages/CitizenPages/MyApplications";
import ApplicationDetails from "../pages/CitizenPages/ApplicationDetails";
import MyDocuments from "../pages/CitizenPages/MyDocuments";

import Navbar from "../components/CitizenComponent/Navbar";
import Sidebar from "../components/CitizenComponent/Sidebar";
import Footer from "../components/CitizenComponent/Footer"; 

function Citizenroutes() {
  const { user } = useAuth(); 
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="app-container" style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      width: "100vw",
      overflow: "hidden" 
    }}>
      
      <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />

      <div className="main-layout" style={{ 
        display: "flex", 
        flex: 1, 
        overflow: "hidden" 
      }}>
        
        <Sidebar isOpen={isOpen} />
 
        <div className="content-area" style={{ 
          flex: 1, 
          display: "flex",
          flexDirection: "column",
          overflowY: "auto", 
          background: "#f0f7ff",
          position: "relative" 
        }}>
          <div style={{ padding: "20px", flex: 1 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="apply" element={<ApplyService />} />
              <Route path="service-details/:id" element={<ServiceDetails />} />
              <Route path="apply-form/:id" element={<ApplicationForm />} />
              <Route path="edit-application/:id" element={<ApplicationForm />} />
              <Route path="my-applications" element={<MyApplications userId={user?.userId} />} />
              <Route path="application-details/:id" element={<ApplicationDetails />} />
              <Route path="my-documents" element={<MyDocuments />} />
              <Route path="grievance" element={<Grievance />} />
              <Route path="notifications" element={<NotificationPage userId={user?.userId} />} />
            </Routes>
          </div>
        </div>
      </div>

      <Footer />
      
    </div>
  );
}

export default Citizenroutes;