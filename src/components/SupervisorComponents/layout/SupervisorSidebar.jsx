import { NavLink } from "react-router-dom";
import {
  FaThLarge,
  FaFolder,
  FaExclamationTriangle,
  FaBell,
  FaUsers,
  FaChartBar
} from "react-icons/fa";

export default function SupervisorSidebar({ open }) {
  return (
    <aside className={`sup-sidebar ${open ? "open" : "closed"}`}>
      <NavLink to="/supervisor/dashboard"><FaThLarge /> Dashboard</NavLink>
      <NavLink to="/supervisor/cases"><FaFolder /> Manage Cases</NavLink>
      <NavLink to="/supervisor/escalations"><FaExclamationTriangle /> Escalations</NavLink>
      <NavLink to="/supervisor/officers"><FaUsers /> Field Officers</NavLink>
      <NavLink to="/supervisor/notifications"><FaBell /> Notifications</NavLink>
      <NavLink to="/supervisor/reports"><FaChartBar /> Reports</NavLink>
    </aside>
  );
}