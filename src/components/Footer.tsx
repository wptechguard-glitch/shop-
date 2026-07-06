import React from "react";
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube, FiMail, FiPhone } from "react-icons/fi";
import "../index.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <h4>ShopKart</h4>
          <p>About Us</p>
          <p>Careers</p>
          <p>Press</p>
          <p>Corporate Info</p>
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          <p>Payments</p>
          <p>Shipping</p>
          <p>Cancellation & Returns</p>
          <p>FAQ</p>
        </div>
        <div className="footer-col">
          <h4>Policy</h4>
          <p>Return Policy</p>
          <p>Terms of Use</p>
          <p>Privacy</p>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p><FiMail className="icon" /> support@shopkart.com</p>
          <p><FiPhone className="icon" /> +91 90000 00000</p>
          <div className="social-row">
            <FiInstagram className="social-icon" />
            <FiFacebook className="social-icon" />
            <FiTwitter className="social-icon" />
            <FiYoutube className="social-icon" />
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 ShopKart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;