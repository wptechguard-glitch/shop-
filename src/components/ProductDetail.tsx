import React, { useState, useEffect } from "react";
import { FiHeart, FiShoppingCart, FiChevronLeft, FiTruck, FiRefreshCw, FiShield } from "react-icons/fi";
import type { Product } from "../data/products";
import ProductCard from "./ProductCart";

interface ProductDetailProps {
  productId: string | number;
  products: Product[];
  onAddToCart: (id: string | number) => void;
  onToggleWishlist: (id: string | number) => void;
  wishlist: (string | number)[];
  onNavigate: (page: string) => void;
}

const sizes = ["S", "M", "L", "XL", "XXL"];

const ProductDetail: React.FC<ProductDetailProps> = ({
  productId,
  products,
  onAddToCart,
  onToggleWishlist,
  wishlist,
  onNavigate,
}) => {
  const product = products.find((p) => String(p.id) === String(productId));
  const [activeImg, setActiveImg] = useState(0);
  const sizeStockMap = product && product.sizes && Array.isArray(product.sizes)
    ? product.sizes.reduce((acc, s) => {
        acc[s.size] = s.quantity;
        return acc;
      }, {} as Record<string, number>)
    : null;

  // Find first size that has stock, default to "M"
  const getInitialSize = () => {
    if (sizeStockMap) {
      const availableSize = sizes.find((s) => (sizeStockMap[s] ?? 0) > 0);
      if (availableSize) return availableSize;
    }
    return "M";
  };

  const [selectedSize, setSelectedSize] = useState(getInitialSize);

  // Auto-scroll to top when product ID changes (for related products navigation)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImg(0); // reset thumbnail to first image
  }, [productId]);

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

  const isWishlisted = wishlist.some((x) => String(x) === String(product.id));
  const related = products.filter((p) => String(p.id) !== String(product.id)).slice(0, 4);

  const selectedSizeQty = sizeStockMap ? (sizeStockMap[selectedSize] ?? 0) : 10;
  const isOutOfStock = !product.inStock || selectedSizeQty <= 0;

  return (
    <div className="product-detail-page">
      <span className="back-link" onClick={() => onNavigate("category")}>
        <FiChevronLeft /> Back to collection
      </span>

      <div className="product-detail-main">
        <div className="detail-gallery">
          <div className="detail-main-img" style={{ position: "relative" }}>
            {isOutOfStock && (
              <div className="out-of-stock-overlay detail-image-out-overlay">
                Out of Stock
              </div>
            )}
            <img
              src={product.images[activeImg] || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80"}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500&q=80";
              }}
            />
          </div>
          <div className="detail-thumb-row">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                className={`detail-thumb ${activeImg === idx ? "active" : ""}`}
                onClick={() => setActiveImg(idx)}
              >
                <img 
                  src={img || "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=100&q=80"} 
                  alt="" 
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=100&q=80";
                  }}
                />
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
              {sizes.map((size) => {
                const qty = sizeStockMap ? (sizeStockMap[size] ?? 0) : 10;
                const isSizeOutOfStock = qty <= 0;
                return (
                  <button
                    key={size}
                    className={`size-chip ${selectedSize === size ? "active" : ""} ${isSizeOutOfStock ? "out-of-stock-size" : ""}`}
                    onClick={() => !isSizeOutOfStock && setSelectedSize(size)}
                    style={{
                      opacity: isSizeOutOfStock ? 0.5 : 1,
                      textDecoration: isSizeOutOfStock ? "line-through" : "none",
                      cursor: isSizeOutOfStock ? "not-allowed" : "pointer",
                      position: "relative"
                    }}
                    title={isSizeOutOfStock ? "Out of Stock" : `${qty} items left`}
                  >
                    {size}
                    {isSizeOutOfStock && <span className="size-badge-out">Out</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="add-cart-btn detail-add-btn"
              onClick={() => !isOutOfStock && onAddToCart(product.id)}
              disabled={isOutOfStock}
              style={{
                background: isOutOfStock ? "#ccc" : "",
                cursor: isOutOfStock ? "not-allowed" : "pointer"
              }}
            >
              <FiShoppingCart className="icon" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
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
              isWishlisted={wishlist.some((x) => String(x) === String(p.id))}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;