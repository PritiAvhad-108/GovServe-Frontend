import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdSecurity,
  MdAccessTime,
  MdApartment,
  MdHomeRepairService,
  MdFactCheck,
  MdDescription,
  MdDeviceHub,
  MdErrorOutline,
  MdBarChart,
  MdPeople,
  MdLogout
} from "react-icons/md";
import "./layout.css";
import logo from "../../../assets/landing/logo.png";

export default function Sidebar() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="sidebar">

        {/*  NAVIGATION */}
        <ul className="nav">
          <li><NavLink className="nav-link" to="/admin/dashboard"><MdDashboard /> Dashboard</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/roles"><MdSecurity /> Roles</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/sla-days"><MdAccessTime /> SLA Days</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/departments"><MdApartment /> Departments</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/services"><MdHomeRepairService /> Services</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/eligibility-rules"><MdFactCheck /> Eligibility Rules</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/required-documents"><MdDescription /> Required Documents</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/workflow-stages"><MdDeviceHub /> Workflow Stages</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/sla-records"><MdErrorOutline /> SLA Records</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/reports"><MdBarChart /> Reports</NavLink></li>
          <li><NavLink className="nav-link" to="/admin/users"><MdPeople /> Users</NavLink></li>
        </ul>

        {/*  PROFESSIONAL LOGOUT SECTION */}
        <div className="sidebar-logout">
          <button
            className="logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <MdLogout size={18} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/*  LOGOUT CONFIRMATION POPUP */}
      {showLogoutConfirm && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h4>Confirm Log Out</h4>
            <p>Are you sure you want to log out?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}