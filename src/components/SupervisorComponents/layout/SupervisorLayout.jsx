import React from "react";
import { Outlet } from "react-router-dom";
import SupervisorSidebar from "./SupervisorSidebar";
import SupervisorNavbar from "./SupervisorNavbar";

export default function SupervisorLayout() {
  return (
    <div className="app-layout">
      {/* Sidebar stays at left */}
      <SupervisorSidebar />

      {/* Right section */}
      <div className="main-layout">
        <SupervisorNavbar />

        {/* Outlet is REQUIRED for nested routes */}
        <div className="page-content">
          <Outlet />
        </div>
      </div>

      {/* Inline Scoped CSS */}
      <style>{`
        .app-layout {
          display: flex;
          min-height: 100vh;
          background: #f1f5f9;
          font-family: "Inter", sans-serif;
        }

        /* Sidebar width is 260px, so we offset the main layout */
        .main-layout {
          margin-left: 260px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        /* Navbar styling */
        .topbar {
          height: 75px;
          background: #1e3a8a; /* Supervisor navbar color */
          display: flex;
          align-items: center;
          padding: 0 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .topbar-inner {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          width: 100%;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #ffffff;
        }

        .topbar-actions svg {
          color: #ffffff;
          font-size: 20px;
        }

        .topbar-actions span {
          color: #ffffff;
          font-size: 14px;
          font-weight: 500;
        }

        /* Page content area */
        .page-content {
          padding: 30px;
          background: #e4ebef;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}