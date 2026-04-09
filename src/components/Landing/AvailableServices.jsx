import { useEffect, useRef } from "react";

const AvailableServices = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("animate-in");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
  }, []);

  return (
    <section className="services-section fade-section" ref={sectionRef}>
      <h2>Available Services</h2>
      <p className="services-subtitle">
        Everything you need in one place
      </p>

      <div className="services-grid">
        <div className="service-card">
          <div className="icon">📝</div>
          <h3>Service Applications</h3>
          <p>Apply and track government services online</p>
        </div>

        <div className="service-card">
          <div className="icon">🪪</div>
          <h3>Certificates & IDs</h3>
          <p>Apply and download official certificates securely</p>
        </div>

        <div className="service-card">
          <div className="icon">📣</div>
          <h3>Grievance Redressal</h3>
          <p>Report issues and track their resolution</p>
        </div>

        <div className="service-card">
          <div className="icon">⏱️</div>
          <h3>Status Tracking</h3>
          <p>Monitor your service requests in real time</p>
        </div>
      </div>
    </section>
  );
};

export default AvailableServices;