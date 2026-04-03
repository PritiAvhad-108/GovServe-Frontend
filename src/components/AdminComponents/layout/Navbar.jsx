import React from "react";
import "./layout.css";
import { FiBell, FiUser } from "react-icons/fi";


export default function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">

        {/* RIGHT: ACTIONS */}
        <div className="topbar-actions">
          <FiBell size={20} />
          <div className="user-info">
            <FiUser size={20} />
            <span>Admin User</span>
          </div>
        </div>

      </div>
    </header>
  );
}