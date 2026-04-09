import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Upload,
  MessageSquareWarning,
  Bell,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "../../styles/CitizenStyles/common/global.css";

function Sidebar({ isOpen, unreadCount = 0 }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      
      {/*  Dashboard */}
      <NavLink 
        to="/citizen" 
        end
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      {/*  Apply Services */}
      <NavLink 
        to="/citizen/apply" 
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <FileText size={18} />
        <span>Apply Services</span>
      </NavLink>

      {/*  My Applications */}
      <NavLink 
        to="/citizen/my-applications" 
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <FolderOpen size={18} />
        <span>My Applications</span>
      </NavLink>

      {/*  My Documents */}
      <NavLink 
        to="/citizen/my-documents" 
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <Upload size={18} />
        <span>Documents</span>
      </NavLink>

      {/* Grievance */}
      <NavLink 
        to="/citizen/grievance" 
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <MessageSquareWarning size={18} />
        <span>Grievance</span>
      </NavLink>

      {/*  Notifications */}
      <NavLink 
        to="/citizen/notifications" 
        className={({ isActive }) => isActive ? "link active" : "link"}
      >
        <Bell size={18} />
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </NavLink>
    </div>
  );
}

export default Sidebar;