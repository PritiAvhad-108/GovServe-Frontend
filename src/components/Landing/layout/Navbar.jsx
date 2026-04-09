import React from "react";

import { Link, useNavigate } from "react-router-dom"; 

import logo from "../../../assets/landing/logo.png";



const Navbar = () => {

  const navigate = useNavigate();



  const scrollToSection = (id) => {

    const section = document.getElementById(id);

    if (section) {

      section.scrollIntoView({ behavior: "smooth" });

    } else {

      navigate("/");

    }

  };



  return (

    <nav className="navbar">

      <div className="navbar-left">

        <div className="logo-wrapper">

          <img src={logo} alt="GovServe Logo" className="navbar-logo" />

        </div>

        <div className="brand-info">

          <h3>GovServe</h3>

          <small>Government Services</small>

        </div>

      </div>



      <div className="navbar-right">

        {/* Navigation Links */}

        <Link to="/" className="nav-link">Home</Link>

        <span className="nav-link" onClick={() => scrollToSection("services")}>Services</span>

       



        {/* Auth Buttons */}

        <div className="auth-nav-buttons">

          <Link to="/login" className="nav-btn login-btn">Login</Link>

          <Link to="/register" className="nav-btn register-btn">Register</Link>

        </div>

      </div>

    </nav>

  );

};



export default Navbar;