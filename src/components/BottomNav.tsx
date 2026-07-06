import React from "react";
import { FiHome, FiGrid, FiHeart, FiShoppingCart } from "react-icons/fi";
import "../index.css";

interface BottomNavProps {
  active: string;
  cartCount: number;
  wishlistCount: number;
  onNavigate: (page: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ active, cartCount, wishlistCount, onNavigate }) => {
  return (
    <div className="bottom-nav mobile-only">
      <div className={`bottom-item ${active === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>
        <FiHome className="icon" />
        <span>Home</span>
      </div>
      <div className={`bottom-item ${active === "category" ? "active" : ""}`} onClick={() => onNavigate("category")}>
        <FiGrid className="icon" />
        <span>Category</span>
      </div>
      <div className={`bottom-item ${active === "wishlist" ? "active" : ""}`} onClick={() => onNavigate("wishlist")}>
        <FiHeart className="icon" />
        {wishlistCount > 0 && <span className="badge-sm">{wishlistCount}</span>}
        <span>Wishlist</span>
      </div>
      <div className={`bottom-item ${active === "cart" ? "active" : ""}`} onClick={() => onNavigate("cart")}>
        <FiShoppingCart className="icon" />
        {cartCount > 0 && <span className="badge-sm">{cartCount}</span>}
        <span>Cart</span>
      </div>
    </div>
  );
};

export default BottomNav;