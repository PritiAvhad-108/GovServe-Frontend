import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";
 
export default function AdminLayout() {
  return (
    <div className="app-layout">
      {/* Sidebar stays at left */}
      <Sidebar />
 
      {/* Right section */}
      <div className="main-layout">
        <Navbar />
 
        {/* ✅ REQUIRED FOR ROUTER v6 */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
 