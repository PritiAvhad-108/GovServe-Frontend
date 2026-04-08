import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SLADistributionChart({ onTime, breached }) {
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
      {(onTime + breached) === 0 ? (
        <p>No SLA data</p>
      ) : (
        <Pie data={data} />
      )}
    </div>
  );
}
