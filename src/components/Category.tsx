import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCart";
import { products } from "../data/products";

interface CategoryProps {
  onAddToCart: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
  onNavigate: (page: string) => void;
}

const genderTabs = ["Women", "Men"];

const categoryList = [
  "All", "Anarkali", "A-Line", "Straight", "Kaftan", "Angrakha",
  "Flared", "Printed", "Designer", "Party Wear", "Casual",
  "Peplum", "Long", "Short", "Ethnic", "Embroidered",
];

// Add your own 3 banner image URLs here
const bannerImages = ["", "", ""];

const Category: React.FC<CategoryProps> = ({ onAddToCart, onToggleWishlist, wishlist, onNavigate }) => {
  const [gender, setGender] = useState("Women");
  const [active, setActive] = useState("All");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const genderFiltered = products.filter((p) => p.category === gender);
  const filtered =
    active === "All" ? genderFiltered : genderFiltered.filter((p) => p.name.includes(active));

  return (
    <div className="category-page">
      {/* Luxury rotating banner */}
      <div className="category-hero">
        {bannerImages.map((img, idx) => (
          <div
            key={idx}
            className={`category-hero-slide ${activeSlide === idx ? "active" : ""}`}
            style={{
              backgroundImage: `url(${img || "https://via.placeholder.com/1400x500?text=ShopKart+Collection"})`,
            }}
          />
        ))}
        <div className="category-hero-overlay" />
        <div className="category-hero-content">
          <span className="category-hero-badge">✨ Curated Collection</span>
          <h1>The Ethnic Wear Edit</h1>
          <p>
            Handpicked kurtis, sarees and suits crafted with premium fabrics
            and timeless silhouettes — made for those who value elegance in
            every detail.
          </p>
          <div className="category-hero-dots">
            {bannerImages.map((_, idx) => (
              <span
                key={idx}
                className={`category-hero-dot ${activeSlide === idx ? "active" : ""}`}
                onClick={() => setActiveSlide(idx)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Trust stats strip */}
      <div className="category-stats-strip">
        <div className="category-stat">
          <h3>100%</h3>
          <p>Premium Fabric</p>
        </div>
        <div className="category-stat">
          <h3>50K+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="category-stat">
          <h3>4.8★</h3>
          <p>Average Rating</p>
        </div>
        <div className="category-stat">
          <h3>7-Day</h3>
          <p>Easy Returns</p>
        </div>
      </div>

      <div className="category-intro">
        <h2>Explore by Style</h2>
        <p>From everyday comfort to festive glamour, find a silhouette for every occasion.</p>
      </div>

      {/* Gender tabs */}
      <div className="gender-tab-row">
        {genderTabs.map((g) => (
          <button
            key={g}
            className={`gender-tab ${gender === g ? "active" : ""}`}
            onClick={() => {
              setGender(g);
              setActive("All");
            }}
          >
            {g}'s Collection
          </button>
        ))}
      </div>

      {gender === "Men" && (
        <div className="coming-soon-banner">
          <span>👔 New arrivals launching soon — add these to your wishlist to get notified first!</span>
        </div>
      )}

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
          <h3>No products found in this category</h3>
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
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;
