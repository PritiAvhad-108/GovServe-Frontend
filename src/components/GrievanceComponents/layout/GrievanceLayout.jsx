import GrievanceNavbar from "./GrievanceNavbar";
import GrievanceSidebar from "./GrievanceSidebar";
import GrievanceFooter from "./GrievanceFooter";
import { Outlet } from "react-router-dom";
import "../../../styles/GrievanceStyles/layout.css";

const GrievanceLayout = () => {
  return (
    <div className="layout-container">
      {/* Top Navbar */}
      <GrievanceNavbar />

      {/* Below Navbar: Sidebar + Page Content */}
      <div className="layout-body">
        <GrievanceSidebar />

        <main className="layout-content">
          <Outlet />

          <GrievanceFooter />
        </main>
      </div>
    </div>
  );
};

export default GrievanceLayout;