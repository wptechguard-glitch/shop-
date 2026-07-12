import React, { useState } from "react";
import { FiMail, FiInstagram, FiStar, FiChevronRight, FiCheck, FiShield, FiRefreshCw, FiTruck } from "react-icons/fi";

export const BrandStory: React.FC = () => {
  return (
    <div className="section-block brand-story-section">
      <div className="brand-story-grid">
        <div className="brand-story-content">
          <span className="section-tagline">OUR HERITAGE</span>
          <h2 className="section-title-left">Crafting Elegance Since 2018</h2>
          <p className="brand-story-text">
            Every thread woven at Gaurangi tells a story of unmatched dedication,
            heritage prints, and the timeless artistry of Indian craftsmen. We bring
            you hand-selected designer wear crafted from premium cotton, luxurious
            muslin, and authentic linen — for both women and men.
          </p>
          <p className="brand-story-text">
            From the royal block prints of Jaipur to the intricate zari work of Banaras,
            our designs seamlessly blend traditional aesthetics with contemporary silhouettes
            for the modern wardrobe.
          </p>
          <div className="brand-promises-row">
            <div className="brand-promise-item">
              <FiShield size={20} className="brand-promise-icon" />
              <div>
                <h5>100% Authentic</h5>
                <p>Handcrafted premium fabrics</p>
              </div>
            </div>
            <div className="brand-promise-item">
              <FiTruck size={20} className="brand-promise-icon" />
              <div>
                <h5>Fast Shipping</h5>
                <p>Pan-India delivery</p>
              </div>
            </div>
            <div className="brand-promise-item">
              <FiRefreshCw size={20} className="brand-promise-icon" />
              <div>
                <h5>Easy Returns</h5>
                <p>7-day hassle-free returns</p>
              </div>
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
    { title: "Festive Glamour", desc: "Zari work Angrakhas paired with gold jewelry — perfect for weddings and celebrations.", image: "/images/kurti-maroon.jpg" },
    { title: "Summer Breeze", desc: "Lightweight pastel kurtis for effortless office wear throughout the season.", image: "/images/kurti-peach.jpg" },
    { title: "Casual Fusion", desc: "Ikat print kurtis styled with smart denim for relaxed weekend outings.", image: "/images/kurti-blue.jpg" },
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
    { name: "Ananya Patel", role: "Fashion Blogger", text: "I ordered the Peach Ikat Denim Kurti and was blown away by the print detail. Will definitely purchase more!", rating: 5 },
    { name: "Sneha Reddy", role: "Verified Buyer", text: "Received so many compliments at my office party. Excellent customer service and fast delivery too.", rating: 5 },
    { name: "Rahul Mehta", role: "Verified Buyer", text: "Ordered the men's kurta and the quality exceeded all expectations. The fabric is premium and stitching is perfect.", rating: 5 },
  ];

  return (
    <div className="section-block testimonials-section">
      <div className="section-header-wrap">
        <div>
          <span className="section-tagline">CUSTOMER REVIEWS</span>
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
    "/images/kurti-mustard.jpg",
  ];

  return (
    <div className="section-block instagram-section">
      <div className="instagram-header">
        <FiInstagram size={22} color="#c9a24b" />
        <h3>Follow Us on Instagram</h3>
        <p>@Gaurangi_Ethnic</p>
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
            <FiCheck size={18} /> Thank you! You have subscribed successfully. Use code <strong>WELCOME15</strong> at checkout.
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
