import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

//data come from Parent component (AdminDashboard) as props onTime, breached
export default function SLADistributionChart({ onTime, breached }) {
  //char configuration - labels, data, colors
  const data = {
    labels: ["On Time", "Breached"],
    datasets: [
      {
        data: [onTime, breached],
        backgroundColor: ["#22c55e", "#ef4444"]
      }
    ]
  };

  return (
    <div className="panel">
      <h3>SLA Distribution</h3>
      {/* // Show message if no data available (conditional rendering)*/}
      {(onTime + breached) === 0 ? (
        <p>No SLA data</p>
      ) : (
        <Pie data={data} />
      )}
    </div>
  );
}
