import { useState, useRef, useEffect } from "react";
import { Menu, Bell, User, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; 
import { toast } from "react-toastify"; 
import logo from "../../assets/landing/logo.png"; 
import "../../styles/CitizenStyles/common/global.css"; 

import CitizenProfilePopup from "../../pages/CitizenPages/CitizenProfilePopup";

function Navbar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth(); 
  const profileRef = useRef();
  const navigate = useNavigate();

  const handleHomeClick = () => {
    logout(); 
    toast.success("Logged out and redirected to Home!"); 
    navigate("/", { replace: true }); 
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
    /* Unique class 'cz-navbar' height fix sathi */
    <nav className="cz-navbar">
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

      <div className="nav-right">
        <div 
          className="nav-action-item" 
          onClick={handleHomeClick} 
          title="Logout & Home"
          style={{ cursor: "pointer" }}
        >
          <Home size={20} />
          <span>Home</span>
        </div>

        <div className="nav-action-item notification-icon" onClick={() => navigate("/citizen/notifications")}>
          <Bell size={20} />
        </div>

        <div className="profile-container" ref={profileRef}>
          <div className="profile-badge" onClick={() => setOpen(!open)}>
            <User size={18} />
            <span>{user?.fullName ? user.fullName.split(' ')[0] : "User"}</span>
          </div>

          {open && (
            <CitizenProfilePopup 
              user={user} 
              onClose={() => setOpen(false)} 
            />
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;