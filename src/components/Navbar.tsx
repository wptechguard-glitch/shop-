import React, { useState } from "react";
import { FiSearch, FiMenu, FiHeart, FiShoppingCart, FiHome, FiGrid, FiUser, FiX, FiLogOut, FiSettings } from "react-icons/fi";
import "../index.css";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  isAdmin?: boolean;
}

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (page: string) => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
}

const GaurangiLogo: React.FC = () => (
  <svg
    viewBox="0 0 100 100"
    className="navbar-logo-svg"
    style={{
      width: "40px",
      height: "40px",
      display: "block",
      flexShrink: 0
    }}
  >
    <defs>
      {/* Lotus Petals Gradient */}
      <linearGradient id="lotusPetalGrad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#800a2a" />
        <stop offset="60%" stopColor="#b83b5e" />
        <stop offset="100%" stopColor="#e84a5f" />
      </linearGradient>
      
      {/* Central Profile Silhouette Golden Gradient */}
      <linearGradient id="goldenFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe066" />
        <stop offset="50%" stopColor="#f5b041" />
        <stop offset="100%" stopColor="#d35400" />
      </linearGradient>
    </defs>

    {/* Outer background/glow shadow */}
    <circle cx="50" cy="50" r="46" fill="#fff9f5" stroke="#f0e2d5" strokeWidth="1.5" />

    {/* Lotus Petal Back Left */}
    <path
      d="M 50 82 C 30 75 16 55 24 38 C 29 28 44 38 50 52"
      fill="url(#lotusPetalGrad)"
      opacity="0.85"
    />

    {/* Lotus Petal Back Right */}
    <path
      d="M 50 82 C 70 75 84 55 76 38 C 71 28 56 38 50 52"
      fill="url(#lotusPetalGrad)"
      opacity="0.85"
    />

    {/* Lotus Petal Middle Left */}
    <path
      d="M 50 85 C 22 76 10 50 14 36 C 18 22 36 34 50 48"
      fill="url(#lotusPetalGrad)"
    />

    {/* Lotus Petal Middle Right */}
    <path
      d="M 50 85 C 78 76 90 50 86 36 C 82 22 64 34 50 48"
      fill="url(#lotusPetalGrad)"
    />

    {/* Lotus Petal Outer Left Wing */}
    <path
      d="M 50 85 C 20 85 4 72 6 56 C 8 42 26 48 38 60"
      fill="url(#lotusPetalGrad)"
      opacity="0.9"
    />

    {/* Lotus Petal Outer Right Wing */}
    <path
      d="M 50 85 C 80 85 96 72 94 56 C 92 42 74 48 62 60"
      fill="url(#lotusPetalGrad)"
      opacity="0.9"
    />

    {/* Lotus Petal Center Bud/Frame */}
    <path
      d="M 50 88 C 32 75 32 45 48 30 C 49 28 51 28 52 30 C 68 45 68 75 50 88 Z"
      fill="url(#lotusPetalGrad)"
    />

    {/* Central Flame Leaf in Gold */}
    <path
      d="M 50 22 C 34 38 34 66 50 82 C 66 66 66 38 50 22 Z"
      fill="url(#goldenFaceGrad)"
    />

    {/* Elegant Woman's Profile Silhouette in Maroon, facing right */}
    <path
      d="M 45,35 
         C 47,35 48.5,37 49,39 
         C 49.5,41 51.5,42.5 54,43 
         L 55,43.5 
         L 51.5,45.5 
         C 52.5,46.5 52.5,47 52,47.5 
         C 51.2,48 50.2,48 49.8,48.5 
         C 50.8,49 51.2,49.5 50.2,50.5 
         C 49.2,51.5 48,52 47.5,54 
         C 47,56 48,59 49,63 
         C 46,63 44,61.5 43.5,58.5 
         C 42.5,53.5 43,48.5 44,43.5 
         C 41.5,39.5 40.5,35.5 42.5,33.5 
         C 43.5,32.5 45,34 45,35 Z"
      fill="#800a2a"
    />
  </svg>
);

const Navbar: React.FC<NavbarProps> = ({ cartCount, wishlistCount, onNavigate, currentUser, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(`search:${searchText}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        {/* Logo SVG + Brand Name */}
        <div className="store-name" onClick={() => onNavigate("home")}>
          <GaurangiLogo />
          <span className="navbar-brand-text">Gau<span>rangi</span></span>
        </div>

        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search kurtis..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button type="submit"><FiSearch /></button>
        </form>

        <div className="navbar-links desktop-only">
          <div className="nav-item" onClick={() => onNavigate("home")}>
            <FiHome className="icon" /><span>Home</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate("category")}>
            <FiGrid className="icon" /><span>Category</span>
          </div>
          <div className="nav-item" onClick={() => onNavigate("wishlist")}>
            <FiHeart className="icon" /><span>Wishlist</span>
            {wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}
          </div>
          <div className="nav-item" onClick={() => onNavigate("cart")}>
            <FiShoppingCart className="icon" /><span>Cart</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </div>

          {currentUser ? (
            <div className="nav-item user-menu-wrap" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <FiUser className="icon" />
              <span>Hi, {currentUser.fullName.split(" ")[0]}</span>
              {userMenuOpen && (
                <div className="user-dropdown">
                  <div onClick={() => { onNavigate("orders"); setUserMenuOpen(false); }}>
                    My Orders
                  </div>
                  {currentUser.isAdmin && (
                    <div onClick={() => { onNavigate("admin"); setUserMenuOpen(false); }}>
                      <FiSettings className="icon" /> Admin Panel
                    </div>
                  )}
                  <div
                    onClick={() => {
                      setUserMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    <FiLogOut className="icon" /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="nav-item" onClick={() => onNavigate("login")}>
              <FiUser className="icon" /><span>Login</span>
            </div>
          )}
        </div>

        <div className="menu-icon mobile-only" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {currentUser ? (
            <>
              <div>Hi, {currentUser.fullName.split(" ")[0]} 👋</div>
              <div onClick={() => { onNavigate("orders"); setMenuOpen(false); }}>
                <FiUser className="icon" /> My Orders
              </div>
              {currentUser.isAdmin && (
                <div onClick={() => { onNavigate("admin"); setMenuOpen(false); }}>
                  <FiSettings className="icon" /> Admin Panel
                </div>
              )}
              <div
                onClick={() => {
                  setMenuOpen(false);
                  onLogout?.();
                }}
              >
                <FiLogOut className="icon" /> Logout
              </div>
            </>
          ) : (
            <>
              <div onClick={() => { onNavigate("login"); setMenuOpen(false); }}><FiUser className="icon" /> Login</div>
              <div onClick={() => { onNavigate("register"); setMenuOpen(false); }}>Register</div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
