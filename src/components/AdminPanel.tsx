import React, { useState, useEffect } from "react";
import {
  FiPackage, FiUsers, FiTrendingUp, FiShoppingBag,
  FiRefreshCw, FiCheck, FiTruck, FiClock, FiLogOut,
  FiChevronDown, FiSearch, FiAlertCircle
} from "react-icons/fi";
import { API_BASE_URL } from "../api";

const ADMIN_SECRET = "shopkart_admin_2024_secure";

interface AdminOrder {
  _id: string;
  orderId: string;
  userId: { fullName: string; email: string; phone?: string } | null;
  items: { id: number; name: string; price: number; qty: number }[];
  total: number;
  address: {
    fullName: string; phone: string; addressLine: string;
    city: string; state: string; pincode: string;
  };
  paymentMethod: string;
  status: "Processing" | "Shipped" | "Delivered";
  date: string;
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  processing: number;
  shipped: number;
  delivered: number;
}

const statusConfig = {
  Processing: { color: "#d4a017", bg: "#faf3e7", label: "Processing", icon: <FiClock size={13}/> },
  Shipped:    { color: "#3a7bd5", bg: "#e3edf7", label: "Shipped",    icon: <FiTruck size={13}/> },
  Delivered:  { color: "#34a853", bg: "#e5f2e9", label: "Delivered",  icon: <FiCheck size={13}/> },
};

// ─── LOGIN SCREEN ────────────────────────────────────────
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_SECRET) {
      sessionStorage.setItem("admin_auth", "true");
      onLogin();
    } else {
      setError("Incorrect admin password. Please try again.");
    }
  };

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <FiShoppingBag size={32} color="#c9a24b" />
          <h1>ShopKart <span>Admin</span></h1>
        </div>
        <p className="admin-login-sub">Secure Admin Panel — Staff Only</p>

        <form onSubmit={handleSubmit}>
          <label className="field-label" style={{ color: "#eee" }}>Admin Password</label>
          <div className="input-group" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)" }}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ background: "transparent", color: "white" }}
            />
          </div>
          {error && (
            <p style={{ color: "#ff6b6b", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <FiAlertCircle size={13}/> {error}
            </p>
          )}
          <button type="submit" className="auth-btn" style={{ marginTop: 8 }}>
            Access Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── STAT CARD ───────────────────────────────────────────
const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number; color: string; bg: string }> =
  ({ icon, label, value, color, bg }) => (
  <div className="admin-stat-card" style={{ borderLeft: `4px solid ${color}` }}>
    <div className="admin-stat-icon" style={{ background: bg, color }}>{icon}</div>
    <div>
      <p className="admin-stat-label">{label}</p>
      <h3 className="admin-stat-value">{value}</h3>
    </div>
  </div>
);

// ─── MAIN ADMIN PANEL ─────────────────────────────────────
const AdminPanel: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-secret": ADMIN_SECRET,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/orders`, { headers }),
        fetch(`${API_BASE_URL}/admin/stats`, { headers }),
      ]);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus as AdminOrder["status"] } : o
          )
        );
        // Update stats
        fetchData();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-panel">
      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <FiShoppingBag size={22} color="#c9a24b" />
          <div>
            <h1>ShopKart Admin</h1>
            <p>Order Management Panel</p>
          </div>
        </div>
        <div className="admin-header-right">
          <button className="admin-refresh-btn" onClick={fetchData} disabled={loading}>
            <FiRefreshCw size={14} className={loading ? "spinning" : ""} />
            {loading ? "Loading..." : "Refresh"}
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>
            <FiLogOut size={14} /> Logout
          </button>
          <button className="admin-store-btn" onClick={() => onNavigate("home")}>
            ← Back to Store
          </button>
        </div>
      </div>

      <div className="admin-body">
        {/* ── Stats Row ── */}
        {stats && (
          <div className="admin-stats-grid">
            <StatCard icon={<FiShoppingBag size={20}/>} label="Total Orders"   value={stats.totalOrders}          color="#14213d" bg="#eef1f7"/>
            <StatCard icon={<FiUsers size={20}/>}       label="Total Users"    value={stats.totalUsers}           color="#3a7bd5" bg="#e3edf7"/>
            <StatCard icon={<FiTrendingUp size={20}/>}  label="Total Revenue"  value={`₹${stats.totalRevenue}`}  color="#34a853" bg="#e5f2e9"/>
            <StatCard icon={<FiClock size={20}/>}       label="Processing"     value={stats.processing}           color="#d4a017" bg="#faf3e7"/>
            <StatCard icon={<FiTruck size={20}/>}       label="Shipped"        value={stats.shipped}              color="#3a7bd5" bg="#e3edf7"/>
            <StatCard icon={<FiCheck size={20}/>}       label="Delivered"      value={stats.delivered}            color="#34a853" bg="#e5f2e9"/>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="admin-filters">
          <div className="admin-search-box">
            <FiSearch size={14} color="#999" />
            <input
              type="text"
              placeholder="Search by Order ID, name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="admin-status-tabs">
            {["All", "Processing", "Shipped", "Delivered"].map((s) => (
              <button
                key={s}
                className={`admin-tab ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
                <span className="admin-tab-count">
                  {s === "All" ? orders.length : orders.filter((o) => o.status === s).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders Table ── */}
        <div className="admin-orders-wrap">
          {loading && orders.length === 0 ? (
            <div className="admin-loading">
              <FiRefreshCw size={28} className="spinning" color="#14213d" />
              <p>Loading orders...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="admin-empty">
              <FiPackage size={40} color="#ddd" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="admin-orders-list">
              {filtered.map((order) => {
                const sc = statusConfig[order.status];
                const isExpanded = expandedOrder === order._id;
                const isUpdating = updatingId === order._id;

                return (
                  <div key={order._id} className="admin-order-card">
                    {/* ── Card Header ── */}
                    <div
                      className="admin-order-header"
                      onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    >
                      <div className="admin-order-info">
                        <p className="admin-order-id">{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                        <p className="admin-order-customer">
                          {order.userId?.fullName || "Unknown"} &nbsp;•&nbsp;
                          <span>{order.userId?.email || "—"}</span>
                        </p>
                        <p className="admin-order-date">{order.date} &nbsp;•&nbsp; {order.paymentMethod}</p>
                      </div>

                      <div className="admin-order-right">
                        <span className="admin-amount">₹{order.total}</span>
                        <span className="admin-status-pill" style={{ background: sc.bg, color: sc.color }}>
                          {sc.icon}&nbsp;{sc.label}
                        </span>
                        <FiChevronDown
                          size={16}
                          color="#999"
                          style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "0.2s" }}
                        />
                      </div>
                    </div>

                    {/* ── Expanded Detail ── */}
                    {isExpanded && (
                      <div className="admin-order-detail">
                        <div className="admin-order-cols">
                          {/* Items */}
                          <div className="admin-detail-section">
                            <h5>🛍️ Items</h5>
                            {order.items.map((item) => (
                              <div key={item.id} className="admin-item-row">
                                <span>{item.name} × {item.qty}</span>
                                <span>₹{item.price * item.qty}</span>
                              </div>
                            ))}
                            <div className="admin-item-row admin-item-total">
                              <span>Total</span>
                              <span>₹{order.total}</span>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="admin-detail-section">
                            <h5>📍 Delivery Address</h5>
                            <p className="admin-addr-name">{order.address.fullName}</p>
                            <p>{order.address.addressLine}</p>
                            <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                            <p>📞 {order.address.phone}</p>
                          </div>
                        </div>

                        {/* ── Status Update ── */}
                        <div className="admin-status-update">
                          <h5>🔄 Update Order Status</h5>
                          <div className="admin-status-btns">
                            {(["Processing", "Shipped", "Delivered"] as const).map((s) => {
                              const cfg = statusConfig[s];
                              const isActive = order.status === s;
                              return (
                                <button
                                  key={s}
                                  className={`admin-status-action-btn ${isActive ? "active" : ""}`}
                                  style={isActive ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color } : {}}
                                  onClick={() => !isActive && updateStatus(order._id, s)}
                                  disabled={isActive || isUpdating}
                                >
                                  {isUpdating && !isActive ? (
                                    <FiRefreshCw size={13} className="spinning" />
                                  ) : cfg.icon}
                                  &nbsp;{s}
                                  {isActive && <span className="admin-active-dot" />}
                                </button>
                              );
                            })}
                          </div>
                          {isUpdating && (
                            <p className="admin-updating-text">
                              <FiRefreshCw size={12} className="spinning" /> Updating status...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
