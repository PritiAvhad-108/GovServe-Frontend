import { useNavigate } from "react-router-dom";
import {
  MdDashboard,
  MdAssignment,
  MdGavel,
  MdNotifications,
} from "react-icons/md";

import "../../../styles/GrievanceStyles/sidebar.css";

const GrievanceSidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <ul className="sidebar-list">
        <li onClick={() => navigate("/grievances/dashboard")}>
          <MdDashboard size={18} />
          <span>Dashboard</span>
        </li>

        <li onClick={() => navigate("/grievances/assigned")}>
          <MdAssignment size={18} />
          <span>Grievances</span>
        </li>

        <li onClick={() => navigate("/grievances/appeals")}>
          <MdGavel size={18} />
          <span>Appeals</span>
        </li>

        <li onClick={() => navigate("/grievances/notifications")}>
          <MdNotifications size={18} />
          <span>Notifications</span>
        </li>
      </ul>
    </aside>
  );
};

export default GrievanceSidebar;