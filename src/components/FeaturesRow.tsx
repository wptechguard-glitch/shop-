import React from "react";
import { FiTruck, FiRefreshCw, FiLock, FiAward } from "react-icons/fi";

const features = [
  { icon: <FiTruck />, title: "Free Delivery", sub: "On orders above ₹499" },
  { icon: <FiRefreshCw />, title: "Easy Returns", sub: "7-day return policy" },
  { icon: <FiLock />, title: "Secure Payment", sub: "100% safe checkout" },
  { icon: <FiAward />, title: "Premium Quality", sub: "Handpicked collection" },
];

const FeaturesRow: React.FC = () => {
  return (
    <div className="features-strip">
      {features.map((f, idx) => (
        <div className="feature-strip-item" key={idx}>
          <span className="feature-strip-icon">{f.icon}</span>
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