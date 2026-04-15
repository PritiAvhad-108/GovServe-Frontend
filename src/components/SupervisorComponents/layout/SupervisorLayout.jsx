import { useState } from "react";
import { Outlet } from "react-router-dom";
import SupervisorNavbar from "./SupervisorNavbar";
import SupervisorSidebar from "./SupervisorSidebar";
import "./Layout.css";
import Footer from "./Footer";
export default function SupervisorLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="sup-layout">
      <SupervisorNavbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <SupervisorSidebar open={isSidebarOpen} />

      <main
        className={`sup-content ${isSidebarOpen ? "with-sidebar" : "full"}`}
      >
        <Outlet />
        {/* Footer */}
                <Footer />
      </main>
    </div>
  );
}