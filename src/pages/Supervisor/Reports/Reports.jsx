import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Reports.css";
import { Pie, Bar } from "react-chartjs-2";
import {Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,LinearScale, BarElement} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const Reports = () => {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const res = await axios.get("https://localhost:7027/api/Case/all");
    setCases(res.data);
  };

  const statusCount = cases.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const departmentCount = cases.reduce((acc, c) => {
    acc[c.departmentName] = (acc[c.departmentName] || 0) + 1;
    return acc;
  }, {});

  /*  Status → Color mapping */
  const statusColors = {
    Approved: "#16a34a",   // green
    Assigned: "#3b82f6",   // blue
    Escalated: "#9333ea",  // purple
    Rejected: "#f59e0b",   // orange
    Breached: "#dc2626",   // red
    Pending: "#9ca3af"     // gray 
  };

  const pieLabels = Object.keys(statusCount);

  const pieData = {
    labels: pieLabels,
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor: pieLabels.map(
          status => statusColors[status] || "#6b7280"
        )
      }
    ]
  };

  const barData = {
    labels: Object.keys(departmentCount),
    datasets: [
      {
        label: "Cases",
        data: Object.values(departmentCount),
        backgroundColor: "#2563eb"
      }
    ]
  };

  return (
    <div className="reports-page">
      <h2>Reports</h2>

      <div className="reports-grid">
        <div className="report-card">
          <h3>Cases by Status</h3>
          <Pie data={pieData} />
        </div>

        <div className="report-card">
          <h3>Cases by Department</h3>
          <Bar data={barData} />
        </div>
      </div>
    </div>
  );
};

export default Reports;