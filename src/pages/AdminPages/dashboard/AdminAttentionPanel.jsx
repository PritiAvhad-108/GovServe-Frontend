import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
 //prpops: pendingUsers, breachedSLAs, pendingSlaCases (all numbers) - these will be passed from parent component (AdminDashboard) based on API data
export default function AdminAttentionPanel({
  pendingUsers,
  breachedSLAs,
  pendingSlaCases
}) {
  const navigate = useNavigate();

  return (
    <div className="panel attention-panel">
      <h3>Admin Attention Required</h3>

      <div
        className="attention-item"
        onClick={() => navigate("/admin/users")}
      >
        <span>Pending User Approvals</span>
        <strong>{pendingUsers}</strong>
        <ChevronRight size={18} />
      </div>

      <div
        className="attention-item"
        onClick={() => navigate("/admin/sla-records")}
      >
        <span>SLA Breaches</span>
        <strong>{breachedSLAs}</strong>
        <ChevronRight size={18} />
      </div>

      <div
        className="attention-item"
        onClick={() =>
          navigate("/admin/sla-records", { state: { view: "pending" } }) //Navigate with state to show only pending cases (filter target page based on this state)
        }
      >
        <span>Cases Requiring SLA Setup</span>
        <strong>{pendingSlaCases}</strong>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
