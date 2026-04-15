import React from "react";
import { Link } from "react-router-dom"; 
import AvailableServices from "../components/Landing/AvailableServices";
import WhyChoose from "../components/Landing/WhyChoose";
import StatsAndCTA from "../components/Landing/StatsAndCTA";
import boxImage from "../assets/landing/box_image.jpg";
import "../styles/LandingStyle/global.css";

const Home = () => {
  return (
    <div className="landing-page-wrapper">
      <section className="hero">
        <div className="hero-left">
          <h1>
            Welcome <br />
            <span>Government Services</span>
          </h1>

          <p>
            Access government services, submit applications, track requests,
            and manage your documents all in one secure platform.
          </p>

          <div className="hero-buttons hover-effect">
            <Link to="/register" className="primary-btnn">
              Register Now
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>
          </div>

          <p className="signin-text">
            Already have an account?{" "}
            <Link 
              to="/login" 
              style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
            >
              Sign in here
            </Link>
          </p>
        </div>

        <div className="hero-right">
          <img
            src={boxImage}
            alt="Government Building"
            className="hero-box-image"
          />
        </div>
      </section>

      <div id="services">
        <AvailableServices />
      </div>
      
      <div id="about">
        <WhyChoose />
      </div>
      
      <StatsAndCTA />
    </div>
  );
};

export default Home;