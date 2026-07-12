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

    {/* Golden silhouette of a woman's profile in the center */}
    <path
      d="M 50 84 
         C 43 78 40 68 41 58 
         C 42 50 46 45 48 40 
         C 49 38 48 36 47 37 
         C 44 41 42 45 42 50
         C 42 55 45 57 44 60
         C 43 62 40 61 38 59
         C 41 64 45 66 45 70
         C 45 74 48 78 50 84 Z"
      fill="url(#goldenFaceGrad)"
    />
    
    <path
      d="M 49 38
         C 50 35 52 32 54 30
         C 55 29 56 30 55 32
         C 53 36 51 40 50 44
         C 49 46 48 48 48 50
         C 48 53 50 55 52 54
         C 54 53 53 50 51 49
         C 53 51 55 54 55 58
         C 55 62 53 65 52 68
         C 50 72 49 76 50 80
         C 50 81 50 82 50 83
         C 51 80 52 77 53 74
         C 54 70 56 67 57 63
         C 58 59 58 55 56 51
         C 54 46 51 42 49 38 Z"
      fill="url(#goldenFaceGrad)"
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
