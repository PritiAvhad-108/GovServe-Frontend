import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaFolder,
  FaExclamationTriangle,
  FaBell,
  FaUsers,
  FaSignOutAlt,
  FaShieldAlt,
  FaChartBar
} from "react-icons/fa";

export default function SupervisorSidebar() {
  return (
    <div className="sidebar">
      {/* Branding Section */}
      <div className="sidebar-logo">
        <div className="logo-icon-bg">
          <FaShieldAlt size={20} />
        </div>
        <div className="logo-text">
          <span className="brand-name">GovServe</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <ul className="nav-list">
        <li>
          <NavLink to="/supervisor/dashboard" className="nav-link">
            <FaThLarge className="link-icon" /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/cases" className="nav-link">
            <FaFolder className="link-icon" /> Manage Cases
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/escalations" className="nav-link">
            <FaExclamationTriangle className="link-icon" /> Escalations
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/officers" className="nav-link">
            <FaUsers className="link-icon" /> Field Officers
          </NavLink>
        </li>

        <li>
          <NavLink to="/supervisor/notifications" className="nav-link">
            <FaBell className="link-icon" /> Notifications
          </NavLink>
        </li>

        {/*  Reports */}
        <li>
          <NavLink to="/supervisor/reports" className="nav-link">
            <FaChartBar className="link-icon" /> Reports
          </NavLink>
        </li>
      </ul>

      {/* Logout */}
      <div className="logout-section">
        <NavLink to="/logout" className="nav-link logout-btn">
          <FaSignOutAlt className="link-icon" /> Logout
        </NavLink>
      </div>

      {/* SIDEBAR CSS — RESTORED */}
      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: #f0f7f9;
          border-right: 1px solid #cfdee4;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 24px 20px;
          border-bottom: 1px solid #cfdee4;
          background: #ffffff;
        }

        .logo-icon-bg {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #1e40af;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
        }

        .nav-list {
          list-style: none;
          padding: 20px 0;
          margin: 0;
          flex: 1;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          margin: 4px 14px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          color: #475569;
          border-radius: 10px;
        }

        .nav-link:hover {
          background: #e0e7ff;
        }

        .nav-link.active {
          background: #1e40af;
          color: #ffffff;
          font-weight: 600;
        }

        .logout-section {
          padding: 20px;
          border-top: 1px solid #cfdee4;
        }

        .logout-btn {
          color: #dc2626;
        }
      `}</style>
    </div>
  );
}