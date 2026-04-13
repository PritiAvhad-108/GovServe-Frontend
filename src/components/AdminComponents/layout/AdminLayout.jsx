import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "../../Landing/layout/Footer"; // ✅ ADD FOOTER IMPORT
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

        {/* ✅ FOOTER (VISIBLE ON ALL ADMIN PAGES) */}
        {/* <Footer /> */}
      </div>
    </div>
  );
}