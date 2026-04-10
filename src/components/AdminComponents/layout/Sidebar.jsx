import React from "react";
import { NavLink } from "react-router-dom";
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
  return (
    <div className="sidebar">

      <div className="sidebar-brand-wrapper">
        <div >
          <img src={logo} alt="GovServe Logo" className="sidebar-logo" />
        </div>

        <div className="brand-info">
          <h3>GovServe</h3>
          <small>Government Services</small>
        </div>
      </div>

      <ul className="nav flex-column">

        <li>
          <NavLink className="nav-link" to="/admin/dashboard">
            <MdDashboard size={18} /> Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/roles">
            <MdSecurity size={18} /> Roles
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/sla-days">
            <MdAccessTime size={18} /> SLA Days
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/departments">
            <MdApartment size={18} /> Departments
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/services">
            <MdHomeRepairService size={18} /> Services
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/eligibility-rules">
            <MdFactCheck size={18} /> Eligibility Rules
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/required-documents">
            <MdDescription size={18} /> Required Documents
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/workflow-stages">
            <MdDeviceHub size={18} /> Workflow Stages
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/sla-records">
            <MdErrorOutline size={18} /> SLA Records
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/reports">
            <MdBarChart size={18} /> Reports
          </NavLink>
        </li>

        <li>
          <NavLink className="nav-link" to="/admin/users">
            <MdPeople size={18} /> Users
          </NavLink>
        </li>

      </ul>

      <div className="logout-section">
        <NavLink className="nav-link logout-btn" to="/logout">
          <MdLogout size={20} /> Logout
        </NavLink>
      </div>

    </div>
  );
}