import React, { useState } from "react";
import { FiHeart, FiShoppingCart, FiChevronLeft, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import { products } from "../data/products";
import ProductCard from "./ProductCart";

interface ProductDetailProps {
  productId: number;
  onAddToCart: (id: number) => void;
  onToggleWishlist: (id: number) => void;
  wishlist: number[];
  onNavigate: (page: string) => void;
}

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onNavigate,
}) => {
  const product = products.find((p) => p.id === productId);
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");

  if (!product) {
    return (
      <div className="empty-state">
        <h3>Product not found</h3>
        <button className="continue-btn" onClick={() => onNavigate("home")}>
          Back to Home
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.includes(product.id);
  const related = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="product-detail-page">
      <span className="back-link" onClick={() => onNavigate("category")}>
        <FiChevronLeft /> Back to collection
      </span>

      <div className="product-detail-main">
        <div className="detail-gallery">
          <div className="detail-main-img">
            <img
              src={product.images[activeImg] || "https://via.placeholder.com/500x600?text=Kurti"}
              alt={product.name}
            />
          </div>
          <div className="detail-thumb-row">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`detail-thumb ${activeImg === idx ? "active" : ""}`}
                onClick={() => setActiveImg(idx)}
              >
                <img src={img || "https://via.placeholder.com/100x120?text=Kurti"} alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="detail-info">
          <span className="detail-badge">Premium Ethnic Wear</span>
          <h1 className="detail-title">{product.name}</h1>

          <div className="detail-rating-row">
            <span className="rating-badge">{product.rating} ★</span>
            <span className="detail-review-count">128 reviews</span>
          </div>

          <div className="detail-price-row">
            <span className="detail-price">₹{product.price}</span>
            <span className="original-price">₹{product.originalPrice}</span>
            <span className="discount">{product.discount}% off</span>
          </div>

          <p className="detail-desc">
            Crafted with premium fabric and finished with intricate detailing,
            this piece brings together timeless ethnic elegance with everyday
            comfort. Perfect for festive occasions or a refined casual look.
          </p>

          <div className="detail-size-block">
            <span className="field-label">Select Size</span>
            <div className="size-row">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-chip ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="detail-actions">
            <button className="add-cart-btn detail-add-btn" onClick={() => onAddToCart(product.id)}>
              <FiShoppingCart className="icon" /> Add to Cart
            </button>
            <button
              className={`detail-wishlist-btn ${isWishlisted ? "active" : ""}`}
              onClick={() => onToggleWishlist(product.id)}
            >
              <FiHeart />
            </button>
          </div>

          <div className="detail-trust-row">
            <div className="trust-item">
              <FiTruck /> Free Delivery
            </div>
            <div className="trust-item">
              <FiRefreshCw /> Easy 7-Day Returns
            </div>
            <div className="trust-item">
              <FiShield /> Secure Payment
            </div>
          </div>
        </div>
      </div>

      <div className="detail-related">
        <h2>You May Also Like</h2>
        <div className="product-grid">
          {related.map((p) => (
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
      </div>
    </div>
  );
};

export default ProductDetail;