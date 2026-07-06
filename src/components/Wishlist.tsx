import React from "react";
import { FiHeart } from "react-icons/fi";
import ProductCard from "./ProductCart";
import { products } from "../data/products";

interface WishlistProps {
  wishlist: number[];
  onAddToCart: (id: number) => void;
  onToggleWishlist: (id: number) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ wishlist, onAddToCart, onToggleWishlist }) => {
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <FiHeart className="empty-icon" />
        <h3>Wishlist khali hai</h3>
        <p>Jo kurti pasand aaye, uspe heart icon dabao</p>
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
        />
      ))}
    </div>
  );
};

export default Wishlist;