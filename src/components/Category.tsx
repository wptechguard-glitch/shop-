import React, { useState } from "react";
import ProductCard from "./ProductCart";
import { products } from "../data/products";

interface CategoryProps {
  onAddToCart: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
}

const categoryList = [
  "All", "Anarkali", "A-Line", "Straight", "Kaftan", "Angrakha",
  "Flared", "Printed", "Designer", "Party Wear", "Casual",
  "Peplum", "Long", "Short", "Ethnic", "Embroidered",
];

const Category: React.FC<CategoryProps> = ({ onAddToCart, onToggleWishlist, wishlist }) => {
  const [active, setActive] = useState("All");

  const filtered = active === "All" ? products : products.filter((p) => p.name.includes(active));

  return (
    <div className="category-page">
      <div className="category-chip-row">
        {categoryList.map((cat) => (
          <button
            key={cat}
            className={`chip ${active === cat ? "active" : ""}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h3>Is category me abhi kuch nahi mila</h3>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.includes(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;