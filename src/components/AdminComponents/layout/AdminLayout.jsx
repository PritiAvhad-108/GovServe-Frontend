import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./layout.css";

export default function AdminLayout() {
  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Right section */}
      <div className="main-layout">
        {/* Top Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>

        {/* ✅ FOOTER */}
        
        <Footer />
      </div>
    </div>
  );
}
