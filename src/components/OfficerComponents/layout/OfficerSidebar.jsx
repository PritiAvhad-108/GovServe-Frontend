import React from 'react';
import { NavLink } from 'react-router-dom';
import './OfficerSidebar.css';

const OfficerSidebar = () => {
  const menus = [
    { path: '/officer/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/officer/assigned-cases', label: 'Assigned Cases', icon: 'assignment' },
    
    
    { path: '/officer/pending-review', label: 'Pending Review', icon: 'hourglass_empty' },
    
    
    { path: '/officer/resubmitted', label: 'Resubmitted', icon: 'history' },
    { path: '/officer/approved', label: 'Approved', icon: 'check_circle' },
    { path: '/officer/rejected', label: 'Rejected', icon: 'cancel' },
    
    { path: '/officer/sla-workflow', label: 'SLA Tracking', icon: 'timer' }
  ];

  return (
    <div className="sidebar">
      
      {/* Header */}
      <div className="sidebar-brand">
        <h2>Officer Panel</h2>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menus.map(menu => (
          <NavLink
            key={menu.path}
            to={menu.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="material-icons sidebar-icon">
              {menu.icon}
            </span>
            <span className="nav-label">
              {menu.label}
            </span>
            
          </NavLink>
        ))}
      </nav>

    </div>
  );
};

export default OfficerSidebar;