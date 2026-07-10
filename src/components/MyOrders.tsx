import React, { useState } from "react";
import { FiPackage, FiChevronRight, FiArrowLeft, FiMapPin, FiTruck, FiCreditCard, FiCalendar, FiHash } from "react-icons/fi";
import type { Order } from "../App";

interface MyOrdersProps {
  orders: Order[];
  onNavigate: (page: string) => void;
}

const statusSteps = ["Processing", "Shipped", "Delivered"];

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
  Processing: { bg: "#faf3e7", text: "#9a7423", dot: "#d4a017" },
  Shipped:    { bg: "#e3edf7", text: "#2f5a8f", dot: "#3a7bd5" },
  Delivered:  { bg: "#e5f2e9", text: "#2f7a4f", dot: "#34a853" },
};

// ─── ORDER DETAIL VIEW ────────────────────────────────────────────
const OrderDetail: React.FC<{ order: Order; onBack: () => void }> = ({ order, onBack }) => {
  const stepIndex = statusSteps.indexOf(order.status);
  const colors = statusColors[order.status] || statusColors.Processing;

  return (
    <div className="order-detail-page">
      <button className="order-detail-back" onClick={onBack}>
        <FiArrowLeft /> Back to Orders
      </button>

      <div className="order-detail-header">
        <div>
          <p className="order-id-label"><FiHash style={{ marginRight: 4 }} />Order ID</p>
          <h2 className="order-detail-id">{order.id}</h2>
          <p className="order-detail-meta">
            <FiCalendar size={12} style={{ marginRight: 4 }} />{order.date}
            &nbsp;•&nbsp;
            <FiCreditCard size={12} style={{ marginRight: 4 }} />{order.paymentMethod}
          </p>
        </div>
        <span
          className="order-status-badge"
          style={{ background: colors.bg, color: colors.text, fontSize: 13, padding: "7px 16px" }}
        >
          {order.status}
        </span>
      </div>

      {/* ── Tracking Timeline ── */}
      <div className="order-track-card">
        <h4><FiTruck style={{ marginRight: 6 }} />Order Tracking</h4>
        <div className="order-track-steps">
          {statusSteps.map((step, i) => {
            const done = i <= stepIndex;
            const active = i === stepIndex;
            return (
              <div key={step} className="order-track-step">
                <div className="order-track-col">
                  <div
                    className="order-track-dot"
                    style={{
                      background: done ? colors.dot : "#e0e0e0",
                      boxShadow: active ? `0 0 0 4px ${colors.bg}` : "none",
                    }}
                  />
                  {i < statusSteps.length - 1 && (
                    <div
                      className="order-track-line"
                      style={{ background: i < stepIndex ? colors.dot : "#e0e0e0" }}
                    />
                  )}
                </div>
                <div className="order-track-info">
                  <p className="order-track-label" style={{ color: done ? "#1f1b1a" : "#aaa", fontWeight: active ? 700 : 500 }}>
                    {step}
                  </p>
                  <p className="order-track-desc" style={{ color: done ? "#666" : "#ccc" }}>
                    {step === "Processing" && "Order confirmed & being prepared"}
                    {step === "Shipped"    && "Package handed to courier"}
                    {step === "Delivered"  && "Package delivered to your address"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Items ── */}
      <div className="order-detail-card">
        <h4><FiPackage style={{ marginRight: 6 }} />Items Ordered ({order.items.length})</h4>
        <div className="order-items-full">
          {order.items.map((item) => (
            <div key={item.id} className="order-item-full-row">
              <div className="order-item-img-placeholder">
                <FiPackage size={20} color="#aaa" />
              </div>
              <div className="order-item-full-details">
                <p className="order-item-name">{item.name}</p>
                <p className="order-item-sub">Qty: {item.qty} × ₹{item.price}</p>
              </div>
              <span className="order-item-total">₹{item.price * item.qty}</span>
            </div>
          ))}
        </div>

        <div className="order-price-summary">
          <div className="price-detail-row">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>
          <div className="price-detail-row">
            <span>Delivery</span>
            <span className="discount-text">FREE</span>
          </div>
          <div className="price-detail-divider" />
          <div className="price-detail-row total-row">
            <span>Total Paid</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* ── Delivery Address ── */}
      <div className="order-detail-card">
        <h4><FiMapPin style={{ marginRight: 6 }} />Delivery Address</h4>
        <div className="order-address-block">
          <p className="order-address-name">{order.address.fullName}</p>
          <p>{order.address.addressLine}</p>
          <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
          <p>📞 {order.address.phone}</p>
        </div>
      </div>
    </div>
  );
};

// ─── ORDER LIST VIEW ──────────────────────────────────────────────
const MyOrders: React.FC<MyOrdersProps> = ({ orders, onNavigate }) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (selectedOrder) {
    return <OrderDetail order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

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
        {orders.map((order) => {
          const colors = statusColors[order.status] || statusColors.Processing;
          return (
            <div
              className="order-card order-card-clickable"
              key={order.id}
              onClick={() => setSelectedOrder(order)}
            >
              <div className="order-card-top">
                <div>
                  <span className="order-id-label">Order ID</span>
                  <p className="order-id-value">{order.id}</p>
                </div>
                <span
                  className="order-status-badge"
                  style={{ background: colors.bg, color: colors.text }}
                >
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

              <p className="order-track-hint">👆 Click to view details & track order</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;
