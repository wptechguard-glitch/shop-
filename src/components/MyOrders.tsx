import React from "react";
import { FiPackage, FiChevronRight } from "react-icons/fi";
import type { Order } from "../App";

interface MyOrdersProps {
  orders: Order[];
  onNavigate: (page: string) => void;
}

const MyOrders: React.FC<MyOrdersProps> = ({ orders, onNavigate }) => {
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <FiPackage className="empty-icon" />
        <h3>No orders yet</h3>
        <p>Looks like you haven't placed any orders yet</p>
        <button className="continue-btn" onClick={() => onNavigate("home")}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h2 className="orders-heading">My Orders</h2>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-card-top">
              <div>
                <span className="order-id-label">Order ID</span>
                <p className="order-id-value">{order.id}</p>
              </div>
              <span className={`order-status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>

            <div className="order-items-preview">
              {order.items.map((item) => (
                <div className="order-item-row" key={item.id}>
                  <span>{item.name} × {item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="order-card-bottom">
              <div>
                <span className="order-date">{order.date}</span>
                <span className="order-method"> • {order.paymentMethod}</span>
              </div>
              <div className="order-total-row">
                <strong>₹{order.total}</strong>
                <FiChevronRight />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
