import React from "react";

interface CategoryShowcaseProps {
  onNavigate: (page: string) => void;
}

const genders = [
  {
    id: "women",
    label: "Women's",
    desc: "Kurtis, Anarkalis, Ethnic Sets",
    image: "/images/kurti-maroon.jpg",
  },
  {
    id: "men",
    label: "Men's",
    desc: "Kurtas, Nehru Jackets, Sherwani",
    image: "/images/kurti-blue.jpg",
  },
];

const quickCats = [
  "New Arrivals", "Best Sellers", "Party Wear", "Festive", "Casual", "Embroidered", "Printed", "Sale",
];

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigate }) => {
  return (
    <section className="cat-showcase-section">
      {/* Gender cards */}
      <div className="cat-gender-grid">
        {genders.map((g) => (
          <div
            key={g.id}
            className="cat-gender-card"
            onClick={() => onNavigate("category")}
          >
            <div
              className="cat-gender-bg"
              style={{ backgroundImage: `url(${g.image})` }}
            />
            <div className="cat-gender-fade" />
            <div className="cat-gender-info">
              <h3>{g.label}</h3>
              <p>{g.desc}</p>
              <span className="cat-gender-cta">Shop Now</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick navigation chips */}
      <div className="cat-quick-row">
        {quickCats.map((c) => (
          <button key={c} className="cat-quick-chip" onClick={() => onNavigate("category")}>
            {c}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryShowcase;