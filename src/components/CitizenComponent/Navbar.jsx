import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, LogOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify";
import logo from "../../assets/landing/logo.png"; 
import "../../styles/CitizenStyles/common/global.css"; 

function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const profileRef = useRef();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* LEFT: Logo & Brand */}
      <div className="nav-left">
        <Menu className="menu-icon" onClick={toggleSidebar} />
        <div className="brand-wrapper" onClick={() => navigate("/citizen")}>
          <img src={logo} alt="Logo" className="nav-logo" />
          <div className="brand-text">
            <h3>GovServe</h3>
            <small>Government Services</small>
          </div>
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="nav-right">
        <div className="nav-action-item" onClick={() => navigate("/")} title="Home">
          <Home size={20} />
          <span>Home</span>
        </div>

        <div className="nav-action-item notification-icon" onClick={() => navigate("/citizen/notifications")}>
          <Bell size={20} />
        </div>

        <div className="profile-container" ref={profileRef} onClick={() => setOpen(!open)}>
          <div className="profile-badge">
            <User size={18} />
            <span>{user?.fullName ? user.fullName.split('@')[0] : "User"}</span>
          </div>

          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => navigate("/citizen/profile")}>My Profile</div>
              <hr />
              <div className="dropdown-item logout-red" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;