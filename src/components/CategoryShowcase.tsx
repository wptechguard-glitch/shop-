import React from "react";

interface CategoryShowcaseProps {
  onNavigate: (page: string) => void;
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigate }) => {
  return (
    <div className="section-block gender-showcase-section">
      <h2 className="section-title">Shop by Gender</h2>
      <p className="section-subtitle">Explore curated collections crafted for every style and occasion</p>
      <div className="gender-showcase-grid">
        {/* Women's Card */}
        <div
          className="gender-showcase-card women-card"
          onClick={() => onNavigate("category")}
        >
          <div className="gender-showcase-bg" style={{ backgroundImage: "url(/images/kurti-maroon.jpg)" }} />
          <div className="gender-showcase-overlay" />
          <div className="gender-showcase-content">
            <span className="gender-showcase-tag">New Collection</span>
            <h3>Women's</h3>
            <p>Kurtis, Anarkalis, Ethnic Sets and more</p>
            <button className="gender-showcase-btn">Explore Women</button>
          </div>
        </div>

        {/* Men's Card */}
        <div
          className="gender-showcase-card men-card"
          onClick={() => onNavigate("category")}
        >
          <div className="gender-showcase-bg" style={{ backgroundImage: "url(/images/kurti-blue.jpg)" }} />
          <div className="gender-showcase-overlay" />
          <div className="gender-showcase-content">
            <span className="gender-showcase-tag">Trending</span>
            <h3>Men's</h3>
            <p>Kurtas, Nehru Jackets, Sherwani and more</p>
            <button className="gender-showcase-btn">Explore Men</button>
          </div>
        </div>
      </div>

      {/* Sub category chips */}
      <div className="sub-category-strip">
        {["Anarkali", "Straight Cut", "A-Line", "Festive", "Casual", "Party Wear", "Embroidered", "Printed"].map((cat) => (
          <button key={cat} className="sub-cat-chip" onClick={() => onNavigate("category")}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;