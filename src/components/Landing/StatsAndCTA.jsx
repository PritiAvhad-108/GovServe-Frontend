import React from "react";
import { Link } from "react-router-dom"; 
const StatsAndCTA = () => {
  return (
    <>
  
      <section className="stats-section">
        <div className="stat-item">
          <h2>50K+</h2>
          <p>Registered Citizens</p>
        </div>

        <div className="stat-item">
          <h2>100K+</h2>
          <p>Applications Processed</p>
        </div>

        <div className="stat-item">
          <h2>98%</h2>
          <p>Satisfaction Rate</p>
        </div>

        <div className="stat-item">
          <h2>24/7</h2>
          <p>Support Available</p>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>
          Join thousands of citizens already using our portal for their
          government services
        </p>

        <div className="cta-buttons">
          
          <Link to="/register" className="primary-btnn">
            Create Account
          </Link>
          
          <Link to="/login" className="secondary-btn">
            Sign In
          </Link>
        </div>
      </section>
    </>
  );
};

export default StatsAndCTA;