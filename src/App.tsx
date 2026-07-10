import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import Checkout from "./components/Checkout";
import type { Address } from "./components/Checkout";
import Payment from "./components/Payment";
import OrderSuccess from "./components/OrderSuccess";
import MyOrders from "./components/MyOrders";
import AdminPanel from "./components/AdminPanel";
import Category from "./components/Category";
import Wishlist from "./components/Wishlist";
import CartPage from "./components/CartPage";
import ProductCard from "./components/ProductCart";
import ProductDetail from "./components/ProductDetail";
import { products } from "./data/products";
import HeroBanner from "./components/HeroBanner";
import FeaturesRow from "./components/FeaturesRow";
import CategoryShowcase from "./components/CategoryShowcase";
import SectionHeader from "./components/SectionHeader";
import ScrollReveal from "./components/ScrollReveal";
import { API_BASE_URL } from "./api";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered";
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
}

const App: React.FC = () => {
  // Read initial page from URL query param e.g. ?page=admin
  const getInitialPage = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "home";
  };
  const [page, setPageState] = useState(getInitialPage);

  // Wrapper: update state AND URL together
  const setPage = (newPage: string) => {
    setPageState(newPage);
    const url = newPage === "home" ? window.location.pathname : `?page=${newPage}`;
    window.history.pushState({ page: newPage }, "", url);
  };

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePop = (e: PopStateEvent) => {
      const p = e.state?.page || new URLSearchParams(window.location.search).get("page") || "home";
      setPageState(p);
    };
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingAddress, setPendingAddress] = useState<Address | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Check localStorage on app load — keeps user logged in after refresh
  useEffect(() => {
    const savedToken = localStorage.getItem("shopkart_token");
    const savedUser = localStorage.getItem("shopkart_user");
    if (savedToken && savedUser) {
      setAuthToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch orders from backend when authenticated
  useEffect(() => {
    if (!authToken) {
      setOrders([]);
      return;
    }
    
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const mappedOrders = (data.orders || []).map((o: any) => ({
            id: o.orderId || o._id,
            items: o.items,
            total: o.total,
            address: o.address,
            paymentMethod: o.paymentMethod,
            date: o.date,
            status: o.status
          }));
          setOrders(mappedOrders);
        }
      } catch (err) {
        console.error("Failed to fetch orders from backend:", err);
      }
    };

    fetchOrders();
  }, [authToken]);

  const handleLoginSuccess = (token: string, user: AuthUser) => {
    setAuthToken(token);
    setCurrentUser(user);
    localStorage.setItem("shopkart_token", token);
    localStorage.setItem("shopkart_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem("shopkart_token");
    localStorage.removeItem("shopkart_user");
    setPage("home");
  };

  const addToCart = (id: number) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const incrementCart = (id: number) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const decrementCart = (id: number) =>
    setCart((prev) => {
      const qty = (prev[id] || 0) - 1;
      const updated = { ...prev };
      if (qty <= 0) delete updated[id];
      else updated[id] = qty;
      return updated;
    });

  const removeFromCart = (id: number) =>
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });

  const toggleWishlist = (id: number) =>
    setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((prod) => prod.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const handlePlaceAddress = (address: Address) => {
    setPendingAddress(address);
  };

  const handlePlaceOrder = async (paymentMethod: string) => {
    if (!pendingAddress) return;

    const orderItems = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((prod) => prod.id === Number(id))!;
      return { id: p.id, name: p.name, price: p.price, qty };
    });

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          items: orderItems,
          total: cartTotal,
          address: pendingAddress,
          paymentMethod
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Order placement failed:", data.message);
        alert(data.message || "Failed to place order. Please try again.");
        return;
      }

      const createdOrder: Order = {
        id: data.order.orderId || data.order._id,
        items: data.order.items,
        total: data.order.total,
        address: data.order.address,
        paymentMethod: data.order.paymentMethod,
        date: data.order.date,
        status: data.order.status
      };

      setOrders((prev) => [createdOrder, ...prev]);
      setLastOrder(createdOrder);
      setCart({});
      setPendingAddress(null);
      setPage("order-success");
    } catch (err) {
      console.error("Order placement network error:", err);
      alert("Network error: Unable to connect to server. Please try again.");
    }
  };

  const renderPage = (): React.ReactNode => {
    if (page === "login") return <Login onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;
    if (page === "register") return <Register onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;

    // Authenticate gate for checkout, payment, and orders
    if (page === "checkout" || page === "payment") {
      if (!currentUser) {
        return <Login onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;
      }
    }

    if (page === "checkout")
      return (
        <Checkout
          totalAmount={cartTotal}
          onNavigate={setPage}
          onPlaceAddress={handlePlaceAddress}
        />
      );

    if (page === "payment")
      return (
        <Payment
          totalAmount={cartTotal}
          onNavigate={setPage}
          onPlaceOrder={handlePlaceOrder}
        />
      );

    if (page === "order-success" && lastOrder)
      return (
        <OrderSuccess
          orderId={lastOrder.id}
          totalAmount={lastOrder.total}
          paymentMethod={lastOrder.paymentMethod}
          onNavigate={setPage}
        />
      );

    if (page === "orders") {
      if (!currentUser) {
        return <Login onNavigate={setPage} onLoginSuccess={handleLoginSuccess} />;
      }
      return <MyOrders orders={orders} onNavigate={setPage} />;
    }

    if (page === "admin")
      return <AdminPanel onNavigate={setPage} />;

    if (page === "category")
      return (
        <Category
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          onNavigate={setPage}
        />
      );
    if (page === "wishlist")
      return (
        <Wishlist
          wishlist={wishlist}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          onNavigate={setPage}
        />
      );
    if (page === "cart")
      return (
        <CartPage
          cart={cart}
          onIncrement={incrementCart}
          onDecrement={decrementCart}
          onRemove={removeFromCart}
          onNavigate={setPage}
        />
      );
    if (page.startsWith("product:")) {
      const id = Number(page.split(":")[1]);
      return (
        <ProductDetail
          productId={id}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          wishlist={wishlist}
          onNavigate={setPage}
        />
      );
    }

    return (
      <>
        <HeroBanner onNavigate={setPage} />

        <ScrollReveal>
          <FeaturesRow />
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <CategoryShowcase onNavigate={setPage} />
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <SectionHeader title="Trending Kurtis" onViewAll={() => setPage("category")} />
          <div className="product-grid">
            {products.slice(0, 10).map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(p.id)}
                onNavigate={setPage}
              />
            ))}
          </div>
        </ScrollReveal>
      </>
    );
  };

  // Admin page — no navbar/footer chrome
  if (page === "admin") {
    return <AdminPanel onNavigate={setPage} />;
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onNavigate={setPage}
        currentUser={currentUser}
        onLogout={handleLogout}
      />
      {renderPage()}
      <Footer />
      <BottomNav active={page} cartCount={cartCount} wishlistCount={wishlist.length} onNavigate={setPage} />
    </>
  );
};

export default App;
