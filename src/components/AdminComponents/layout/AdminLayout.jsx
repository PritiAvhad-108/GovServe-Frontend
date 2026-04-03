import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./layout.css";

export default function AdminLayout({ children }) {
  return (
    <div className="app-layout">
      {/* Sidebar stays at left */}
      <Sidebar />

      {/* Right section */}
      <div className="main-layout">
        <Navbar />

        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
}