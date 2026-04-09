const WhyChoose = () => {
  return (
    <section className="why-choose">
      <h2>Why Choose Our Portal?</h2>
      <p className="why-subtitle">
        Efficient, secure, and user-friendly
      </p>

      <div className="why-grid">
        <div className="why-card">
          <div className="why-icon">✅</div>
          <h3>Easy to Use</h3>
          <p>Intuitive interface designed for everyone</p>
        </div>

        <div className="why-card">
          <div className="why-icon">🕒</div>
          <h3>24/7 Access</h3>
          <p>Access services anytime, anywhere</p>
        </div>

        <div className="why-card">
          <div className="why-icon">🔒</div>
          <h3>Secure</h3>
          <p>Your data is protected with encryption</p>
        </div>

        <div className="why-card">
          <div className="why-icon">👥</div>
          <h3>Support</h3>
          <p>Dedicated help when you need it</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;