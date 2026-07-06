import React from "react";

interface CategoryShowcaseProps {
  onNavigate: (page: string) => void;
}

const categories = [
  { name: "New Arrivals", image: "" },
  { name: "Best Sellers", image: "" },
  { name: "Party Wear", image: "" },
  { name: "Sale", image: "" },
];

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ onNavigate }) => {
  return (
    <div className="section-block">
      <h2 className="section-title">Shop by Category</h2>
      <div className="category-showcase-grid">
        {categories.map((cat) => (
          <div className="category-showcase-card" key={cat.name} onClick={() => onNavigate("category")}>
            <img
              src={cat.image || "https://via.placeholder.com/300x350?text=Category"}
              alt={cat.name}
            />
            <div className="category-showcase-label">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryShowcase;