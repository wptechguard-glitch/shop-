import React, { useState } from "react";
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

const App: React.FC = () => {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingAddress, setPendingAddress] = useState<Address | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

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

  const handlePlaceOrder = (paymentMethod: string) => {
    if (!pendingAddress) return;

    const orderItems: OrderItem[] = Object.entries(cart).map(([id, qty]) => {
      const p = products.find((prod) => prod.id === Number(id))!;
      return { id: p.id, name: p.name, price: p.price, qty };
    });

    const newOrder: Order = {
      id: "ORD" + Date.now().toString().slice(-8),
      items: orderItems,
      total: cartTotal,
      address: pendingAddress,
      paymentMethod,
      date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      status: "Processing",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart({});
    setPendingAddress(null);
  };

  const renderPage = (): React.ReactNode => {
    if (page === "login") return <Login onNavigate={setPage} onLoginSuccess={() => {}} />;
    if (page === "register") return <Register onNavigate={setPage} />;

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

    if (page === "orders")
      return <MyOrders orders={orders} onNavigate={setPage} />;

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

  return (
    <>
      <Navbar cartCount={cartCount} wishlistCount={wishlist.length} onNavigate={setPage} />
      {renderPage()}
      <Footer />
      <BottomNav active={page} cartCount={cartCount} wishlistCount={wishlist.length} onNavigate={setPage} />
    </>
  );
};

export default App;
