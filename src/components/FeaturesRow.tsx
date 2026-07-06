import React from "react";
import { FiTruck, FiRefreshCw, FiLock, FiAward, FiGift } from "react-icons/fi";

const features = [
  { icon: <FiTruck />, title: "Free Delivery", sub: "On orders above ₹499" },
  { icon: <FiRefreshCw />, title: "Easy Returns", sub: "7 day return policy" },
  { icon: <FiLock />, title: "Secure Payment", sub: "100% safe checkout" },
  { icon: <FiAward />, title: "Premium Quality", sub: "Handpicked collection" },
  { icon: <FiGift />, title: "Gift Wrapping", sub: "Special packaging" },
];

const FeaturesRow: React.FC = () => {
  return (
    <div className="features-row">
      {features.map((f, idx) => (
        <div className="feature-item" key={idx}>
          <span className="feature-icon">{f.icon}</span>
          <div>
            <h5>{f.title}</h5>
            <p>{f.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeaturesRow;