import logo from "../../../assets/landing/logo.png";

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="footer-container">
        {/* Column 1 */}
        <div className="footer-column footer-brand">
  <div className="footer-logo">
    <img src={logo} alt="GovServe Logo" className="footer-logo-img" />
    <h3>GovServe</h3>
  </div>
  <p>
    Your trusted gateway to government services and information.
  </p>
</div>

        {/* Column 2 */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>Services</li>
            <li>About Us</li>
            <li>Contact</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h4>Services</h4>
          <ul>
            <li>Applications</li>
            <li>Documents</li>
            <li>Grievances</li>
            <li>Appeals</li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-column">
          <h4>Contact Us</h4>
          <p>Email: support@GovServe.gov</p>
          <p>Phone: 1-800-GOV-HELP</p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 GovServe. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
};

export default Footer;