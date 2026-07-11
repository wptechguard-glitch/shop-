import React, { useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import type { Product } from "../data/products";
import "../index.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string | number) => void;
  onToggleWishlist: (id: string | number) => void;
  isWishlisted: boolean;
  onNavigate?: (page: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onNavigate,
}) => {
  const [activeImg, setActiveImg] = useState(0);
  const outOfStock = !product.inStock;

  return (
    <div
      className={`product-card ${outOfStock ? "out-of-stock" : ""}`}
      onClick={() => onNavigate?.(`product:${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-wrap">
        {outOfStock ? (
          <div className="out-of-stock-badge">Out of Stock</div>
        ) : (
          <div className="discount-ribbon">{product.discount}% OFF</div>
        )}

        <img
          src={product.images[activeImg] || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80"}
          alt={product.name}
          className={`product-image ${outOfStock ? "dimmed" : ""}`}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=300&q=80";
          }}
        />

        <button
          className={`wishlist-btn ${isWishlisted ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
        >
          <FiHeart />
        </button>

        <div className="thumb-row">
          {product.images.map((_, idx) => (
            <span
              key={idx}
              className={`thumb-dot ${activeImg === idx ? "active" : ""}`}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setActiveImg(idx);
              }}
            />
          ))}
        </div>

        {outOfStock && <div className="out-of-stock-overlay">Currently Unavailable</div>}
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="rating-badge">{product.rating} ★</div>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <span className="original-price">₹{product.originalPrice}</span>
          {!outOfStock && <span className="discount">{product.discount}% off</span>}
        </div>

        <button
          className="add-cart-btn"
          disabled={outOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!outOfStock) onAddToCart(product.id);
          }}
        >
          <FiShoppingCart className="icon" />
          {outOfStock ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
