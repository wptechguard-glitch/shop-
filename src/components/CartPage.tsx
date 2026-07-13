import React from "react";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import type { Product } from "../data/products";

interface CartPageProps {
  products: Product[];
  cart: Record<string | number, number>;
  onIncrement: (id: string | number) => void;
  onDecrement: (id: string | number) => void;
  onRemove: (id: string | number) => void;
  onNavigate: (page: string) => void;
}

const CartPage: React.FC<CartPageProps> = ({ products, cart, onIncrement, onDecrement, onRemove, onNavigate }) => {
  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const product = products.find((p) => String(p.id) === String(id));
      return product ? { ...product, qty } : null;
    })
    .filter(Boolean) as (Product & { qty: number })[];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const originalTotal = cartItems.reduce((sum, item) => sum + item.originalPrice * item.qty, 0);
  const savings = originalTotal - subtotal;
  const deliveryCharge = subtotal > 999 ? 0 : 49;
  const totalAmount = subtotal + deliveryCharge;

  if (cartItems.length === 0) {
    return (
      <div className="empty-state">
        <FiShoppingBag className="empty-icon" />
        <h3>Your Cart is Empty</h3>
        <p>Add some beautiful kurtis to start shopping!</p>
        <button className="continue-btn" onClick={() => onNavigate("home")}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img
              src={item.images[0] || "https://via.placeholder.com/120x150?text=Kurti"}
              alt={item.name}
              className="cart-item-img"
            />
            <div className="cart-item-details">
              <h4>{item.name}</h4>
              <div className="cart-item-price-row">
                <span className="price">₹{item.price}</span>
                <span className="original-price">₹{item.originalPrice}</span>
              </div>

              <div className="qty-control">
                <button onClick={() => onDecrement(item.id)}><FiMinus /></button>
                <span>{item.qty}</span>
                <button onClick={() => onIncrement(item.id)}><FiPlus /></button>
              </div>

              <button className="remove-btn" onClick={() => onRemove(item.id)}>
                <FiTrash2 /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="price-details">
        <h4>Price Details</h4>
        <div className="price-detail-row">
          <span>Price ({cartItems.length} items)</span>
          <span>₹{originalTotal}</span>
        </div>
        <div className="price-detail-row">
          <span>Discount</span>
          <span className="discount-text">- ₹{savings}</span>
        </div>
        <div className="price-detail-row">
          <span>Delivery Charges</span>
          <span>{deliveryCharge === 0 ? <span className="discount-text">FREE</span> : `₹${deliveryCharge}`}</span>
        </div>
        <div className="price-detail-divider" />
        <div className="price-detail-row total-row">
          <span>Total Amount</span>
          <span>₹{totalAmount}</span>
        </div>
        <p className="savings-msg">Aap ₹{savings} bacha rahe hain is order par</p>

        <button className="checkout-btn" onClick={() => onNavigate("checkout")}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;