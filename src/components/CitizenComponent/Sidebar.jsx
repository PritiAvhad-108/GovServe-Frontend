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
   
    <div className={`cz-sidebar ${isOpen ? "cz-open" : "cz-closed"}`}>
      
      <NavLink 
        to="/citizen" 
        end
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </NavLink>

      <NavLink 
        to="/citizen/apply" 
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <FileText size={18} />
        <span>Apply Services</span>
      </NavLink>

      <NavLink 
        to="/citizen/my-applications" 
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <FolderOpen size={18} />
        <span>My Applications</span>
      </NavLink>

      <NavLink 
        to="/citizen/my-documents" 
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <Upload size={18} />
        <span>Documents</span>
      </NavLink>

      <NavLink 
        to="/citizen/grievance" 
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <MessageSquareWarning size={18} />
        <span>Grievance</span>
      </NavLink>

      <NavLink 
        to="/citizen/notifications" 
        className={({ isActive }) => isActive ? "cz-link cz-active" : "cz-link"}
      >
        <Bell size={18} />
        <span>Notifications</span>
        {unreadCount > 0 && (
          <span className="cz-badge">{unreadCount}</span>
        )}
      </NavLink>
    </div>
  );
}

export default Sidebar;