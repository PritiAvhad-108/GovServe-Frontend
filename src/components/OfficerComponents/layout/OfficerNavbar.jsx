// src/components/AdminComponents/layout/OfficerLayout/OfficerNavbar.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// ✅ Logo
import logo from "../../../assets/landing/logo.png";

// ✅ Components
import NotificationBell from "../../../pages/OfficerPages/notifications/OfficerNotifications";
import OfficerProfilePopup from "../../../pages/OfficerPages/OfficerProfile/ProfilePopup";

const OfficerNavbar = () => {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <nav
      style={{
        height: "70px",
        background: "#1a3a8a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      {/* LEFT SIDE LOGO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          cursor: "pointer",
        }}
        onClick={() => navigate("/officer/dashboard")}
      >
        <img
          src={logo}
          alt="GovServe"
          style={{ height: "40px", width: "40px" }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: "18px", fontWeight: "700" }}>
            GovServe
          </span>
          <span
            style={{
              fontSize: "12px",
              opacity: 0.8,
              lineHeight: "1",
            }}
          >
            Government Services
          </span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* 🔔 NOTIFICATION BELL (FORCED VISIBLE) */}
        <div
          style={{
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <NotificationBell />
        </div>

        {/* 👤 PROFILE */}
        <div
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(255,255,255,0.1)",
            padding: "5px 15px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          <span className="material-icons">account_circle</span>
          <span style={{ fontWeight: "500" }}>Officer</span>
        </div>

        {/* PROFILE POPUP */}
        {isProfileOpen && (
          <OfficerProfilePopup onClose={() => setIsProfileOpen(false)} />
        )}
      </div>
    </nav>
  );
};

export default OfficerNavbar;
