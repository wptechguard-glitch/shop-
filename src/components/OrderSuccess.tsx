import React from "react";
import { FiCheckCircle, FiPackage, FiClock } from "react-icons/fi";

interface OrderSuccessProps {
  orderId: string;
  totalAmount: number;
  paymentMethod: string;
  onNavigate: (page: string) => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orderId, totalAmount, paymentMethod, onNavigate }) => {
  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        <div className="checkout-step done">1. Address</div>
        <div className="checkout-step-line done" />
        <div className="checkout-step done">2. Payment</div>
        <div className="checkout-step-line done" />
        <div className="checkout-step active">3. Confirmation</div>
      </div>

      <div className="order-success-card">
        <FiCheckCircle className="success-icon" />
        <h2>Order Placed Successfully!</h2>
        <p className="auth-sub">Thank you for shopping with Gaurangi. Your order is being processed.</p>

        <div className="order-success-details">
          <div className="order-detail-row">
            <span>Order ID</span>
            <strong>{orderId}</strong>
          </div>
          <div className="order-detail-row">
            <span>Amount Paid</span>
            <strong>₹{totalAmount}</strong>
          </div>
          <div className="order-detail-row">
            <span>Payment Method</span>
            <strong>{paymentMethod}</strong>
          </div>
        </div>

        <div className="order-eta">
          <FiClock /> Estimated delivery in 4-6 business days
        </div>

        <div className="order-success-actions">
          <button className="auth-btn" onClick={() => onNavigate("orders")}>
            <FiPackage className="icon" /> Track Your Order
          </button>
          <button className="continue-btn-outline" onClick={() => onNavigate("home")}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
