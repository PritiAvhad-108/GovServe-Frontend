import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Header";
import Footer from "./Footer";
import "./layout.css";

export default function AdminLayout() {
  return (
    <div className="admin-app app-layout">
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

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}