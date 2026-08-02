import React, { useState, useEffect } from "react";
import {
  FiPackage, FiUsers, FiTrendingUp, FiShoppingBag,
  FiRefreshCw, FiCheck, FiTruck, FiClock, FiLogOut,
  FiChevronDown, FiSearch, FiAlertCircle, FiEdit, FiTrash, FiPlus, FiX
} from "react-icons/fi";
import { API_BASE_URL } from "../api";
import type { Product } from "../data/products";
import placeholderImg from "../assets/placeholder.svg";

const ADMIN_SECRET = "c277b72c188553d93d155b8cf205ab8ddd325a0329c5120846b356e7804e77fc";

interface AdminOrder {
  _id: string;
  orderId: string;
  userId: { fullName: string; email: string; phone?: string } | null;
  items: { id: string | number; name: string; price: number; qty: number }[];
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

interface AdminPanelProps {
  onNavigate: (page: string) => void;
  products: Product[];
  onRefreshProducts: () => void;
  currentUser?: any;
}

const statusConfig = {
  Processing: { color: "#9b72cf", bg: "#faf3e7", label: "Processing", icon: <FiClock size={13}/> },
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
          <FiShoppingBag size={32} color="#b8a0d4" />
          <h1>Gaurangi <span>Admin</span></h1>
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
const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate, products, onRefreshProducts, currentUser }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("admin_auth") === "true" || 
          currentUser?.email?.toLowerCase() === "gaurngi@gmail.com"
  );
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Active panel tab: "orders" or "products" or "settings" or "chats"
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "settings" | "chats">("orders");
  const [isCodEnabled, setIsCodEnabled] = useState(true);

  // Chat States
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [selectedChatUserId, setSelectedChatUserId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOriginalPrice, setProdOriginalPrice] = useState("");
  const [prodCategory, setProdCategory] = useState<"Women" | "Men">("Women");
  const [prodInStock, setProdInStock] = useState(true);
  const [prodImages, setProdImages] = useState<string[]>(["", "", "", ""]);
  const [prodSizes, setProdSizes] = useState<Record<string, number>>({ S: 10, M: 15, L: 15, XL: 10, XXL: 5 });
  const [actionLoading, setActionLoading] = useState(false);

  const headers = {
    "Content-Type": "application/json",
    "x-admin-secret": ADMIN_SECRET,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, statsRes, configRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/orders`, { headers }),
        fetch(`${API_BASE_URL}/admin/stats`, { headers }),
        fetch(`${API_BASE_URL}/config`),
      ]);
      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }
      if (statsRes.ok) {
        const data = await statsRes.json();
        setStats(data);
      }
      if (configRes.ok) {
        const data = await configRes.json();
        setIsCodEnabled(data.isCodEnabled);
      }
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCod = async (newVal: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/config`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ isCodEnabled: newVal }),
      });
      if (res.ok) {
        setIsCodEnabled(newVal);
        alert(`Cash on Delivery ${newVal ? "Enabled" : "Disabled"} successfully!`);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update configuration");
      }
    } catch (err) {
      console.error("Update config error:", err);
      alert("Network error: Failed to update configuration");
    }
  };

  const fetchChats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/chats/admin/list`, { headers });
      if (res.ok) {
        const data = await res.json();
        setChatSessions(data.chats || []);
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    }
  };

  const handleAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatUserId || !adminReplyText.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/chats/admin/reply`, {
        method: "POST",
        headers,
        body: JSON.stringify({ userId: selectedChatUserId, text: adminReplyText }),
      });
      if (res.ok) {
        setAdminReplyText("");
        fetchChats();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to send reply");
      }
    } catch (err) {
      console.error("Failed to send admin reply:", err);
    }
  };

  const handleResolveChat = async (userId: string) => {
    if (!window.confirm("Are you sure you want to resolve and archive this chat session?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/chats/admin/resolve/${userId}`, {
        method: "PUT",
        headers,
      });
      if (res.ok) {
        if (selectedChatUserId === userId) {
          setSelectedChatUserId(null);
        }
        fetchChats();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to resolve chat");
      }
    } catch (err) {
      console.error("Failed to resolve chat:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      onRefreshProducts();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && activeTab === "chats") {
      fetchChats();
      const interval = setInterval(fetchChats, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, activeTab, selectedChatUserId]);

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
        fetchData();
      }
    } catch (err) {
      console.error("Status update error:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Product actions: Create/Update
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodOriginalPrice) {
      alert("Please fill all required fields");
      return;
    }

    setActionLoading(true);
    const priceNum = Number(prodPrice);
    const origPriceNum = Number(prodOriginalPrice);
    const discountPercent = origPriceNum > priceNum 
      ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
      : 0;
    
    // Construct sizes array and calculate total stock
    const sizesArray = ["S", "M", "L", "XL", "XXL"].map((sz) => ({
      size: sz,
      quantity: Number(prodSizes[sz]) || 0
    }));
    const totalQty = sizesArray.reduce((sum, s) => sum + s.quantity, 0);
    const effectiveInStock = totalQty > 0;

    // Filter empty image URLs and supply placeholder if none provided
    const validImages = prodImages.filter((img) => img.trim() !== "");
    
    const productPayload = {
      name: prodName,
      price: priceNum,
      originalPrice: origPriceNum,
      discount: discountPercent,
      category: prodCategory,
      inStock: effectiveInStock,
      stockQuantity: totalQty,
      sizes: sizesArray,
      images: validImages.length > 0 ? validImages : ["https://via.placeholder.com/300x380?text=Gaurangi"],
      rating: 4.0
    };

    try {
      // Check if id is a real MongoDB ObjectId (24-char hex string)
      const isMongoId = editingProductId &&
        typeof editingProductId === "string" &&
        /^[a-f\d]{24}$/i.test(editingProductId);

      let url = `${API_BASE_URL}/products`;
      let method = "POST";

      if (isMongoId) {
        // Real DB product — update it
        url = `${API_BASE_URL}/products/${editingProductId}`;
        method = "PUT";
      }
      // If numeric/static ID → always create new in MongoDB

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(productPayload),
      });

      if (res.ok) {
        alert(isMongoId ? "Product updated successfully!" : "Product saved to database!");
        resetProductForm();
        onRefreshProducts();
        fetchData(); // reload stats
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to save product.");
      }
    } catch (err) {
      console.error("Save product error:", err);
      alert("Network error. Could not connect to server.");
    } finally {
      setActionLoading(false);
    }
  };


  // Delete product
  const handleDeleteProduct = async (prodId: string | number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    // Static products (numeric ID) are not in DB — nothing to delete on server
    const isMongoId = typeof prodId === "string" && /^[a-f\d]{24}$/i.test(prodId);
    if (!isMongoId) {
      alert("This product is from the default list and is not stored in the database. Use 'Add New Product' to add your own products.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/products/${prodId}`, {
        method: "DELETE",
        headers,
      });

      if (res.ok) {
        alert("Product deleted successfully!");
        onRefreshProducts();
        fetchData();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete product error:", err);
      alert("Error deleting product.");
    }
  };


  const startEditProduct = (p: Product) => {
    const dbId = p._id || p.id;
    setEditingProductId(dbId);
    setProdName(p.name);
    setProdPrice(String(p.price));
    setProdOriginalPrice(String(p.originalPrice));
    setProdCategory(p.category);
    setProdInStock(p.inStock);
    
    // Map size-wise stock quantity
    if (p.sizes && Array.isArray(p.sizes) && p.sizes.length > 0) {
      const sizesMap: Record<string, number> = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
      p.sizes.forEach((s) => {
        sizesMap[s.size] = s.quantity;
      });
      setProdSizes(sizesMap);
    } else {
      setProdSizes({
        S: p.inStock ? 10 : 0,
        M: p.inStock ? 15 : 0,
        L: p.inStock ? 15 : 0,
        XL: p.inStock ? 10 : 0,
        XXL: p.inStock ? 5 : 0
      });
    }

    // Fill images up to 4 elements
    const filledImages = [...p.images];
    while (filledImages.length < 4) filledImages.push("");
    setProdImages(filledImages);
    
    setShowProductForm(true);
    // No scroll — form is now a modal overlay
  };

  const resetProductForm = () => {
    setEditingProductId(null);
    setProdName("");
    setProdPrice("");
    setProdOriginalPrice("");
    setProdCategory("Women");
    setProdInStock(true);
    setProdSizes({ S: 10, M: 15, L: 15, XL: 10, XXL: 5 });
    setProdImages(["", "", "", ""]);
    setShowProductForm(false);
  };

  const cleanImageUrl = (val: string): string => {
    if (!val) return "";
    
    // 1. Check BBCode [img]...[/img]
    const bbcodeMatch = val.match(/\[img\]\s*(https?:\/\/[^\]\s]+)\s*\[\/img\]/i);
    if (bbcodeMatch) return bbcodeMatch[1].trim();

    // 2. Check HTML img src
    const htmlMatch = val.match(/<img[^>]+src=["']\s*(https?:\/\/[^"'\s]+)\s*["']/i);
    if (htmlMatch) return htmlMatch[1].trim();

    // 3. Check HTML anchor href pointing to direct image
    const hrefMatch = val.match(/href=["']\s*(https?:\/\/[^"'\s]+\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?[^"'\s]*)?)\s*["']/i);
    if (hrefMatch) return hrefMatch[1].trim();

    // 4. Check Markdown image link
    const mdMatch = val.match(/!\[.*?\]\(\s*(https?:\/\/[^\)\s]+)\s*\)/i);
    if (mdMatch) return mdMatch[1].trim();

    // 5. If it contains HTML or brackets, try to extract first URL
    if (val.includes("<") || val.includes("[") || val.includes("(")) {
      const urlMatch = val.match(/(https?:\/\/[^\s"'\]\)>]+)/);
      if (urlMatch) return urlMatch[1].trim();
    }

    return val.trim();
  };

  const updateImageIndex = (index: number, val: string) => {
    const cleaned = cleanImageUrl(val);
    setProdImages((prev) => {
      const copy = [...prev];
      copy[index] = cleaned;
      return copy;
    });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
  }

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      search === "" ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.userId?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Filter products list
  const filteredProducts = products.filter((p) => {
    return (
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="admin-panel">
      {/* ── Header ── */}
      <div className="admin-header">
        <div className="admin-header-left">
          <FiShoppingBag size={22} color="#b8a0d4" />
          <div>
            <h1>Gaurangi Admin</h1>
            <p>{activeTab === "orders" ? "Order Management Panel" : activeTab === "products" ? "Inventory & Products Panel" : activeTab === "chats" ? "Customer Live Chat Support" : "Global System Settings"}</p>
          </div>
        </div>
        
        {/* Tab Switcher */}
        <div className="admin-tab-switcher">
          <button 
            className={`admin-panel-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => { setActiveTab("orders"); setSearch(""); }}
          >
            Orders
          </button>
          <button 
            className={`admin-panel-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => { setActiveTab("products"); setSearch(""); }}
          >
            Products
          </button>
          <button 
            className={`admin-panel-tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setSearch(""); }}
          >
            Settings
          </button>
          <button 
            className={`admin-panel-tab-btn ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => { setActiveTab("chats"); setSearch(""); }}
          >
            Chats
          </button>
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
        
        {/* ── Product Add/Edit Modal Overlay (shown whenever form is open) ── */}
        {(showProductForm || editingProductId !== null) && (
          <div className="admin-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) resetProductForm(); }}>
            <div className="admin-modal-box">
              <div className="form-card-header">
                <h3>{editingProductId ? "Edit Product Details" : "Add New Kurti / Product"}</h3>
                <button className="form-close-btn" onClick={resetProductForm}><FiX size={18} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="admin-product-form">
                <div className="form-grid">
                  <div className="form-group span-2">
                    <label>Product Name (Required)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lavender Zari Work Khadi Angrakha Kurti"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Sale Price / Rate (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 599"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Original / MRP (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="e.g. 1199"
                      value={prodOriginalPrice}
                      onChange={(e) => setProdOriginalPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group span-2">
                    <label>Stock Quantity by Size (S, M, L, XL, XXL)</label>
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      {["S", "M", "L", "XL", "XXL"].map((sz) => (
                        <div key={sz} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
                          <span style={{ fontSize: 11, fontWeight: "bold", color: "#555" }}>{sz}</span>
                          <input
                            type="number"
                            min="0"
                            style={{ width: "100%", textAlign: "center", padding: "6px", borderRadius: "6px", border: "1px solid #ddd" }}
                            value={prodSizes[sz] ?? 0}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value) || 0);
                              setProdSizes((prev) => {
                                const newSizes = { ...prev, [sz]: val };
                                const newTotal = Object.values(newSizes).reduce((sum, v) => sum + v, 0);
                                if (newTotal > 0) setProdInStock(true);
                                else setProdInStock(false);
                                return newSizes;
                              });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      value={prodCategory} 
                      onChange={(e) => setProdCategory(e.target.value as "Women" | "Men")}
                    >
                      <option value="Women">Women's Kurtis</option>
                      <option value="Men">Men's Kurta / Ethnic</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Discount %</label>
                    <input
                      type="text"
                      readOnly
                      value={
                        prodPrice && prodOriginalPrice && Number(prodOriginalPrice) > Number(prodPrice)
                          ? `${Math.round(((Number(prodOriginalPrice) - Number(prodPrice)) / Number(prodOriginalPrice)) * 100)}% OFF (auto)`
                          : "0% (auto)"
                      }
                      style={{ background: "#f8fafc", color: "#888", cursor: "default" }}
                    />
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="switch-label">
                      <input
                        type="checkbox"
                        checked={prodInStock}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setProdInStock(isChecked);
                          if (!isChecked) {
                            setProdSizes({ S: 0, M: 0, L: 0, XL: 0, XXL: 0 });
                          } else {
                            // If they check it but all are 0, set M to 10 as fallback
                            const total = Object.values(prodSizes).reduce((sum, v) => sum + v, 0);
                            if (total === 0) {
                              setProdSizes({ S: 0, M: 10, L: 0, XL: 0, XXL: 0 });
                            }
                          }
                        }}
                      />
                      <span style={{ color: prodInStock ? "#5a3a8c" : "#c0392b", fontWeight: 700 }}>
                        {prodInStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </label>
                    {Object.values(prodSizes).reduce((sum, v) => sum + v, 0) === 0 && (
                      <p style={{ fontSize: 11, color: "#c0392b", marginTop: 4 }}>All sizes are 0 → marked Out of Stock</p>
                    )}
                  </div>
                </div>

                {/* Photo links */}
                <div className="form-images-section">
                  <h4>Product Images (Paste Image URLs)</h4>
                  <p className="helper-text">Add up to 4 photo URLs (host on Imgur, Postimages, or any cloud — paste direct link).</p>
                  
                  <div className="images-grid">
                    {prodImages.map((imgUrl, idx) => (
                      <div key={idx} className="image-url-input-block">
                        <label>Photo {idx + 1} {idx === 0 ? "(Primary)" : ""}</label>
                        <div className="url-input-wrap">
                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={imgUrl}
                            onChange={(e) => updateImageIndex(idx, e.target.value)}
                          />
                          {imgUrl && (
                            <div className="url-preview-thumb">
                              <img 
                                src={imgUrl} 
                                alt="preview" 
                                onError={(e) => { 
                                  e.currentTarget.onerror = null; 
                                  e.currentTarget.src = placeholderImg; 
                                }} 
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="button" className="admin-cancel-btn" onClick={resetProductForm}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-save-btn" disabled={actionLoading}>
                    {actionLoading ? "Saving..." : editingProductId ? "Update Product" : "Publish Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Stats Dashboard ── */}
        {stats && activeTab === "orders" && (
          <div className="admin-stats-grid">
            <StatCard icon={<FiShoppingBag size={20}/>} label="Total Orders"   value={stats.totalOrders}          color="#2d1b4e" bg="#eef1f7"/>
            <StatCard icon={<FiUsers size={20}/>}       label="Total Users"    value={stats.totalUsers}           color="#3a7bd5" bg="#e3edf7"/>
            <StatCard icon={<FiTrendingUp size={20}/>}  label="Total Revenue"  value={`₹${stats.totalRevenue}`}  color="#34a853" bg="#e5f2e9"/>
            <StatCard icon={<FiClock size={20}/>}       label="Processing"     value={stats.processing}           color="#9b72cf" bg="#faf3e7"/>
            <StatCard icon={<FiTruck size={20}/>}       label="Shipped"        value={stats.shipped}              color="#3a7bd5" bg="#e3edf7"/>
            <StatCard icon={<FiCheck size={20}/>}       label="Delivered"      value={stats.delivered}            color="#34a853" bg="#e5f2e9"/>
          </div>
        )}

        {/* ── Active View: ORDERS tab ── */}
        {activeTab === "orders" && (
          <>
            {/* Filters */}
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

            {/* Orders list */}
            <div className="admin-orders-wrap">
              {loading && orders.length === 0 ? (
                <div className="admin-loading">
                  <FiRefreshCw size={28} className="spinning" color="#2d1b4e" />
                  <p>Loading orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="admin-empty">
                  <FiPackage size={40} color="#ddd" />
                  <p>No orders found</p>
                </div>
              ) : (
                <div className="admin-orders-list">
                  {filteredOrders.map((order) => {
                    const sc = statusConfig[order.status];
                    const isExpanded = expandedOrder === order._id;
                    const isUpdating = updatingId === order._id;

                    return (
                      <div key={order._id} className="admin-order-card">
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

                        {isExpanded && (
                          <div className="admin-order-detail">
                            <div className="admin-order-cols">
                              <div className="admin-detail-section">
                                <h5>Items</h5>
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

                              <div className="admin-detail-section">
                                <h5>Delivery Address</h5>
                                <p className="admin-addr-name">{order.address.fullName}</p>
                                <p>{order.address.addressLine}</p>
                                <p>{order.address.city}, {order.address.state} — {order.address.pincode}</p>
                                <p>📞 {order.address.phone}</p>
                              </div>
                            </div>

                            <div className="admin-status-update">
                              <h5>Update Order Status</h5>
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
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Active View: PRODUCTS tab ── */}
        {activeTab === "products" && (
          <>
            <div className="admin-filters">
              <div className="admin-search-box">
                <FiSearch size={14} color="#999" />
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                {products.length === 0 && (
                  <button
                    className="admin-refresh-btn"
                    style={{ background: "#5a3a8c", color: "white", border: "none" }}
                    onClick={async () => {
                      if (!window.confirm("Seed default products into MongoDB? (Only runs if DB is empty)")) return;
                      try {
                        const res = await fetch(`${API_BASE_URL}/products/seed`, { method: "POST", headers });
                        const data = await res.json();
                        alert(data.message);
                        onRefreshProducts();
                      } catch {
                        alert("Seed failed. Check backend connection.");
                      }
                    }}
                  >
                    🌱 Seed DB
                  </button>
                )}
                <button className="admin-store-btn" onClick={() => { setEditingProductId(null); setShowProductForm(true); }}>
                  <FiPlus size={16} /> Add New Product
                </button>
              </div>
            </div>


            {/* Products Inventory list */}
            <div className="admin-inventory-list">
              {filteredProducts.length === 0 ? (
                <div className="admin-empty">
                  <FiPackage size={40} color="#ddd" />
                  <p>No products found. Click 'Add New Product' to start.</p>
                </div>
              ) : (
                <div className="admin-table-wrap">
                  <table className="admin-inventory-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Rate (₹)</th>
                        <th>MRP (₹)</th>
                        <th>Discount</th>
                        <th>Qty</th>
                        <th>Stock Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => {
                        const dbId = p._id || p.id;
                        return (
                          <tr key={String(dbId)}>
                            <td>
                              <img 
                                src={p.images[0] || placeholderImg} 
                                alt={p.name}
                                className="admin-prod-thumb"
                                onError={(e) => { 
                                  e.currentTarget.onerror = null; 
                                  e.currentTarget.src = placeholderImg; 
                                }}
                              />
                            </td>
                            <td className="prod-cell-name">
                              <strong>{p.name}</strong>
                              <span className="prod-id-badge">ID: {String(dbId).slice(-6).toUpperCase()}</span>
                            </td>
                            <td><span className="category-tag">{p.category}</span></td>
                            <td className="price-bold">₹{p.price}</td>
                            <td className="price-struck">₹{p.originalPrice}</td>
                            <td className="discount-tag">{p.discount}% OFF</td>
                            <td className="stock-qty-cell">
                              {p.stockQuantity !== undefined ? p.stockQuantity : "—"}
                            </td>
                            <td>
                              <span className={`stock-badge ${p.inStock ? "in" : "out"}`}>
                                {p.inStock ? "✅ In Stock" : "❌ Out of Stock"}
                              </span>
                            </td>
                            <td>
                              <div className="admin-actions-cell">
                                <button className="act-edit-btn" onClick={() => startEditProduct(p)}>
                                  <FiEdit size={14} /> Edit
                                </button>
                                <button className="act-delete-btn" onClick={() => handleDeleteProduct(dbId)}>
                                  <FiTrash size={14} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Active View: SETTINGS tab ── */}
        {activeTab === "settings" && (
          <div className="admin-settings-card" style={{
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            maxWidth: "600px",
            margin: "20px auto 0 auto"
          }}>
            <h3 style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px", color: "#2d1b4e" }}>
              <FiTruck size={20} color="#b8a0d4" /> Payment Gateways & Methods
            </h3>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "20px 0",
              borderTop: "1px solid #eee",
              borderBottom: "1px solid #eee"
            }}>
              <div>
                <h4 style={{ margin: "0 0 6px 0", color: "#2d1b4e", fontSize: "15px" }}>Cash on Delivery (COD)</h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#777", lineHeight: "1.4" }}>
                  Enable or disable Cash on Delivery payment option at client checkout.
                </p>
              </div>
              <div>
                <label className="toggle-switch" style={{
                  position: "relative",
                  display: "inline-block",
                  width: "52px",
                  height: "28px"
                }}>
                  <input
                    type="checkbox"
                    checked={isCodEnabled}
                    onChange={(e) => handleToggleCod(e.target.checked)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span className="slider" style={{
                    position: "absolute",
                    cursor: "pointer",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: isCodEnabled ? "#34a853" : "#ccc",
                    transition: ".4s",
                    borderRadius: "28px"
                  }}>
                    <span style={{
                      position: "absolute",
                      content: "",
                      height: "20px",
                      width: "20px",
                      left: isCodEnabled ? "28px" : "4px",
                      bottom: "4px",
                      backgroundColor: "white",
                      transition: ".4s",
                      borderRadius: "50%"
                    }} />
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ── Active View: CHATS tab ── */}
        {activeTab === "chats" && (
          <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 200px)", minHeight: "500px" }}>
            {/* Left Column: Chat Sessions List */}
            <div style={{
              width: "320px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              <div style={{ padding: "16px", borderBottom: "1px solid #eee", background: "#f8f9fa" }}>
                <h4 style={{ margin: 0, color: "#2d1b4e" }}>Active Discussions</h4>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {chatSessions.length === 0 ? (
                  <p style={{ padding: "20px", textAlign: "center", color: "#999", fontSize: "13px" }}>No active chats.</p>
                ) : (
                  chatSessions.map((session) => {
                    const isSelected = selectedChatUserId === session.userId;
                    const lastMsg = session.messages[session.messages.length - 1];
                    const isResolved = session.status === "resolved";

                    return (
                      <div
                        key={session.userId}
                        onClick={() => setSelectedChatUserId(session.userId)}
                        style={{
                          padding: "14px 16px",
                          borderBottom: "1px solid #f0f0f0",
                          cursor: "pointer",
                          background: isSelected ? "#f1ecf7" : "transparent",
                          transition: "background 0.2s",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <strong style={{ fontSize: "13px", color: isSelected ? "#2d1b4e" : "#333", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", maxWidth: "160px" }}>
                            {session.userEmail}
                          </strong>
                          <span style={{
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            background: isResolved ? "#e2e3e5" : "#d4edda",
                            color: isResolved ? "#383d41" : "#155724",
                            fontWeight: 600
                          }}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: "11px", color: "#777", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                          {lastMsg ? lastMsg.text : "No messages"}
                        </p>
                        <span style={{ fontSize: "9px", color: "#bbb" }}>
                          {new Date(session.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right Column: Selected Chat Conversation Window */}
            <div style={{
              flex: 1,
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden"
            }}>
              {selectedChatUserId ? (() => {
                const activeSession = chatSessions.find(s => s.userId === selectedChatUserId);
                if (!activeSession) return <div style={{ flex: 1, display: "flex", alignItems: "center", justifyItems: "center" }}><p style={{ margin: "auto", color: "#999" }}>Select a conversation to view</p></div>;
                
                return (
                  <>
                    {/* Header */}
                    <div style={{
                      padding: "16px",
                      borderBottom: "1px solid #eee",
                      background: "#f8f9fa",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <h4 style={{ margin: 0, color: "#2d1b4e" }}>{activeSession.userEmail}</h4>
                        <span style={{ fontSize: "11px", color: "#777" }}>User ID: {activeSession.userId}</span>
                      </div>
                      <button
                        onClick={() => handleResolveChat(activeSession.userId)}
                        style={{
                          background: "#e53935",
                          color: "white",
                          border: "none",
                          padding: "6px 12px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer"
                        }}
                      >
                        Resolve & Archive
                      </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                      flex: 1,
                      padding: "20px",
                      overflowY: "auto",
                      background: "#fafafa",
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px"
                    }}>
                      {activeSession.messages.map((msg: any, i: number) => {
                        const isAdmin = msg.sender === "admin";
                        const isUser = msg.sender === "user";
                        
                        let bubbleBg = "#e9ecef";
                        let alignSelf: "flex-start" | "flex-end" = "flex-start";
                        let label = msg.sender.toUpperCase();

                        if (isAdmin) {
                          bubbleBg = "#d1ecf1";
                          alignSelf = "flex-end";
                          label = "YOU (ADMIN)";
                        } else if (isUser) {
                          bubbleBg = "#e2dcf2";
                          alignSelf = "flex-start";
                          label = "CUSTOMER";
                        } else {
                          bubbleBg = "#fff";
                          alignSelf = "flex-start";
                          label = "BOT RESPONDER";
                        }

                        return (
                          <div key={i} style={{ display: "flex", flexDirection: "column", alignSelf, maxWidth: "70%" }}>
                            <span style={{ fontSize: "9px", color: "#999", fontWeight: 700, marginBottom: "3px", alignSelf: isAdmin ? "flex-end" : "flex-start" }}>
                              {label}
                            </span>
                            <div style={{
                              background: bubbleBg,
                              color: "#333",
                              padding: "10px 14px",
                              borderRadius: isAdmin ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                              fontSize: "13px",
                              lineHeight: "1.5",
                              whiteSpace: "pre-line",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
                            }}>
                              {msg.text}
                            </div>
                            <span style={{ fontSize: "8px", color: "#bbb", marginTop: "2px", alignSelf: isAdmin ? "flex-end" : "flex-start" }}>
                              {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Reply Input Bar */}
                    <form onSubmit={handleAdminReply} style={{
                      display: "flex",
                      borderTop: "1px solid #eee",
                      padding: "12px 16px",
                      background: "white"
                    }}>
                      <input
                        type="text"
                        placeholder="Type reply to client..."
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        style={{
                          flex: 1,
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          outline: "none",
                          fontSize: "13px"
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: "#2d1b4e",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 20px",
                          marginLeft: "12px",
                          fontWeight: 600,
                          fontSize: "13px",
                          cursor: "pointer"
                        }}
                      >
                        Send
                      </button>
                    </form>
                  </>
                );
              })() : (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ color: "#999", fontSize: "14px" }}>Select a chat session from active discussions list to begin support.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPanel;
