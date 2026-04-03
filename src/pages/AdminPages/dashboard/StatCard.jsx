import React from "react";

export default function StatCard({ title, value, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div>
        <p>{title}</p>
        <h3>{value}</h3>
      </div>
    </div>
  );
}