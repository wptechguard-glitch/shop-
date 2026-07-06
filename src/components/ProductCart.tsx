import React, { useState } from "react";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import type { Product } from "../data/products";
import "../index.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (id: number) => void;
  onToggleWishlist: (id: number) => void;
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

  return (
    <div
      className="product-card"
      onClick={() => onNavigate?.(`product:${product.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="product-image-wrap">
        <div className="discount-ribbon">{product.discount}% OFF</div>
        <img
          src={product.images[activeImg] || "https://via.placeholder.com/300x380?text=Kurti"}
          alt={product.name}
          className="product-image"
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
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="rating-badge">{product.rating} ★</div>
        <div className="price-row">
          <span className="price">₹{product.price}</span>
          <span className="original-price">₹{product.originalPrice}</span>
          <span className="discount">{product.discount}% off</span>
        </div>
        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product.id);
          }}
        >
          <FiShoppingCart className="icon" /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;