import React from "react";
import { FiBell, FiUser } from "react-icons/fi";
import { FaChartBar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SupervisorNavbar() {
  const navigate = useNavigate();

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-actions">

          {/* ✅ Reports */}
          <FaChartBar
            size={18}
            className="notification-icon"
            onClick={() => navigate("/supervisor/reports")}
            title="Reports"
          />

          {/* 🔔 Notifications */}
          <FiBell
            size={20}
            className="notification-icon"
            onClick={() => navigate("/supervisor/notifications")}
            title="Notifications"
          />

          <div className="user-info">
            <FiUser size={20} />
            <span>Supervisor User</span>
          </div>
        </div>
      </div>

      {/* ✅ CSS PRESERVED */}
      <style>{`
        .topbar {
          height: 75px;
          background: #1e3a8a;
          display: flex;
          align-items: center;
          padding: 0 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }

        .topbar-inner {
          display: flex;
          justify-content: flex-end;
          width: 100%;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 18px;
          color: #ffffff;
        }

        .notification-icon {
          cursor: pointer;
        }

        .notification-icon:hover {
          color: #c7d2fe;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .topbar-actions svg {
          color: #ffffff;
        }

        .topbar-actions span {
          font-size: 14px;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
}