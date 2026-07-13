import React from "react";
import { FiHeart } from "react-icons/fi";
import ProductCard from "./ProductCart";
import type { Product } from "../data/products";

interface WishlistProps {
  products: Product[];
  wishlist: (string | number)[];
  onAddToCart: (id: string | number) => void;
  onToggleWishlist: (id: string | number) => void;
  onNavigate: (page: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ products, wishlist, onAddToCart, onToggleWishlist, onNavigate }) => {
  const items = products.filter((p) => wishlist.some((x) => String(x) === String(p.id)));

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <FiHeart className="empty-icon" />
        <h3>Your Wishlist is Empty</h3>
        <p>Tap the heart icon on any kurti you love to save it here</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {items.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={true}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
};

export default Wishlist;