import React, { useState } from "react";
import { FiMail, FiInstagram, FiStar, FiChevronRight, FiCheck } from "react-icons/fi";

export const BrandStory: React.FC = () => {
  return (
    <div className="section-block brand-story-section">
      <div className="brand-story-grid">
        <div className="brand-story-content">
          <span className="section-tagline">OUR HERITAGE</span>
          <h2 className="section-title-left">Crafting Elegance Since 2018</h2>
          <p className="brand-story-text">
            Every thread woven at ShopKart tells a story of unmatched dedication, 
            heritage prints, and the timeless artistry of Indian craftsmen. We bring 
            you hand-selected designer Kurtis crafted from premium cotton, luxurious 
            muslin, and authentic linen.
          </p>
          <p className="brand-story-text">
            From the royal block prints of Jaipur to the intricate zari work of Banaras, 
            our designs seamlessly blend traditional aesthetics with contemporary silhouettes 
            for the modern woman.
          </p>
          <div className="story-features">
            <div className="story-feat-item">
              <span className="feat-number">100%</span>
              <span className="feat-label">Handcrafted Cotton</span>
            </div>
            <div className="story-feat-item">
              <span className="feat-number">50K+</span>
              <span className="feat-label">Happy Customers</span>
            </div>
            <div className="story-feat-item">
              <span className="feat-number">150+</span>
              <span className="feat-label">Unique Prints</span>
            </div>
          </div>
        </div>
        <div className="brand-story-image-wrap">
          <img 
            src="/images/designer-studio.jpg" 
            alt="Designer Studio" 
            className="brand-story-image"
          />
          <div className="image-gold-accent-border" />
          <div className="story-floating-badge">
            <h4>Premium Quality</h4>
            <p>Guaranteed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Lookbook: React.FC = () => {
  const looks = [
    { title: "Festive Glamour", desc: "Zari work Angrakhas paired with gold jewelry.", image: "/images/kurti-maroon.jpg" },
    { title: "Summer Breeze", desc: "Lightweight pastel Kurtis for effortless office wear.", image: "/images/kurti-peach.jpg" },
    { title: "Casual Fusion", desc: "Ikat print kurtis styled with smart denim.", image: "/images/kurti-blue.jpg" },
  ];

  return (
    <div className="section-block lookbook-section">
      <div className="section-header-wrap">
        <div>
          <span className="section-tagline">STYLING TIPS</span>
          <h2 className="section-title">Seasonal Lookbook</h2>
        </div>
      </div>
      <div className="lookbook-grid">
        {looks.map((look, index) => (
          <div className="lookbook-card" key={index}>
            <div className="lookbook-img-wrap">
              <img src={look.image} alt={look.title} />
              <div className="lookbook-overlay">
                <span className="lookbook-tag">Look {index + 1}</span>
              </div>
            </div>
            <div className="lookbook-info">
              <h3>{look.title}</h3>
              <p>{look.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Priya Sharma", role: "Verified Buyer", text: "The fabric quality of the Lavender Zari work Kurti is absolutely divine. Super soft, breathable, and fits perfectly!", rating: 5 },
    { name: "Ananya Patel", role: "Fashion Blogger", text: "I ordered the Peach Ikat Denim Kurti and was blown away by the print detail. Will definitely purchase more Kurtis!", rating: 5 },
    { name: "Sneha Reddy", role: "Verified Buyer", text: "Received so many compliments at my office party! Excellent customer service and fast delivery too.", rating: 5 }
  ];

  return (
    <div className="section-block testimonials-section">
      <div className="section-header-wrap">
        <div>
          <span className="section-tagline">REVIEWS</span>
          <h2 className="section-title">What Our Customers Say</h2>
        </div>
      </div>
      <div className="testimonials-grid">
        {reviews.map((rev, index) => (
          <div className="testimonial-card" key={index}>
            <div className="stars-row">
              {[...Array(rev.rating)].map((_, i) => <FiStar key={i} className="star-filled" />)}
            </div>
            <p className="testimonial-text">"{rev.text}"</p>
            <div className="testimonial-author">
              <div>
                <h4>{rev.name}</h4>
                <p>{rev.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const InstagramFeed: React.FC = () => {
  const feedImages = [
    "/images/kurti-maroon.jpg",
    "/images/kurti-peach.jpg",
    "/images/kurti-blue.jpg",
    "/images/kurti-mustard.jpg"
  ];

  return (
    <div className="section-block instagram-section">
      <div className="instagram-header">
        <FiInstagram size={22} color="#c9a24b" />
        <h3>Follow Us on Instagram</h3>
        <p>@ShopKart_Ethnic</p>
      </div>
      <div className="instagram-grid">
        {feedImages.map((img, idx) => (
          <div className="instagram-card" key={idx}>
            <img src={img} alt="Instagram Post" />
            <div className="instagram-overlay">
              <FiInstagram size={24} color="white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="newsletter-banner">
      <div className="newsletter-overlay" />
      <div className="newsletter-content">
        <FiMail size={32} color="#c9a24b" className="newsletter-mail-icon" />
        <h2>Get 15% Off Your First Order</h2>
        <p>Subscribe to receive updates on new collections, private sales, and special offers.</p>
        
        {subscribed ? (
          <div className="subscribed-success-message">
            <FiCheck size={18} /> Thank you! You've subscribed successfully. Use code <strong>WELCOME15</strong> at checkout.
          </div>
        ) : (
          <form onSubmit={handleSub} className="newsletter-form">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">
              Subscribe <FiChevronRight />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
