import React from "react";
import {
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
} from "react-icons/fi";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="footer">
      <div className="footer-newsletter">
        <div className="footer-newsletter-inner">
          <div>
            <h3>Join the ShopKart Circle</h3>
            <p>Be first to know about new arrivals, exclusive collections & private sales.</p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">
              <FiSend /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-top">
        <div className="footer-col footer-brand-col">
          <h4 className="footer-logo">
            Shop<span>Kart</span>
          </h4>
          <p className="footer-tagline">
            Curated ethnic wear for the modern woman — premium kurtis,
            handcrafted sarees and timeless salwar suits.
          </p>
          <div className="social-row">
            <span className="social-icon"><FiInstagram /></span>
            <span className="social-icon"><FiFacebook /></span>
            <span className="social-icon"><FiTwitter /></span>
            <span className="social-icon"><FiYoutube /></span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <p onClick={() => onNavigate?.("category")}>Kurtis & Suits</p>
          <p onClick={() => onNavigate?.("category")}>Sarees</p>
          <p onClick={() => onNavigate?.("category")}>New Arrivals</p>
          <p onClick={() => onNavigate?.("category")}>Hot Sale</p>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <p>Track Your Order</p>
          <p>Shipping & Returns</p>
          <p>Size Guide</p>
          <p>FAQs</p>
        </div>

        <div className="footer-col">
          <h4>Get In Touch</h4>
          <p><FiMapPin /> Jaipur, Rajasthan, India</p>
          <p><FiPhone /> +91 98765 43210</p>
          <p><FiMail /> support@shopkart.com</p>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} ShopKart. All rights reserved.</p>
        <div className="footer-bottom-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;