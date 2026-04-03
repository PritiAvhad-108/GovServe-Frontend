import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
          navigate("/admin/sla-records", { state: { view: "pending" } })
        }
      >
        <span>Cases Requiring SLA Setup</span>
        <strong>{pendingSlaCases}</strong>
        <ChevronRight size={18} />
      </div>
    </div>
  );
}
