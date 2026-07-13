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
  <svg viewBox="0 0 100 120" style={{ width: "42px", height: "50px", display: "block", flexShrink: 0 }}>
    <defs>
      {/* Deep purple/violet gradient for bag body */}
      <linearGradient id="ng1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#b8a0d4" />
        <stop offset="35%"  stopColor="#9b72cf" />
        <stop offset="70%"  stopColor="#7b4fa8" />
        <stop offset="100%" stopColor="#4a2e7a" />
      </linearGradient>
      {/* Light lavender/gold gradient for handle */}
      <linearGradient id="ng2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="#ffe47a" />
        <stop offset="50%"  stopColor="#b8a0d4" />
        <stop offset="100%" stopColor="#5a3a8c" />
      </linearGradient>
      {/* Premium text gradient */}
      <linearGradient id="ntxt" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stopColor="#ffe47a" />
        <stop offset="50%"  stopColor="#b8a0d4" />
        <stop offset="100%" stopColor="#ffe47a" />
      </linearGradient>
      <filter id="nsh">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.8" floodColor="#1a0d2e88" />
      </filter>
      <filter id="nglow">
        <feGaussianBlur stdDeviation="1.2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Bag body */}
    <rect x="8" y="26" width="84" height="68" rx="10" ry="10" fill="url(#ng1)" filter="url(#nsh)" />
    <rect x="11" y="29" width="78" height="62" rx="8" ry="8" fill="none" stroke="rgba(255,255,200,0.2)" strokeWidth="1.5"/>
    {/* Bag handle */}
    <path d="M 30 26 Q 30 4 50 4 Q 70 4 70 26" fill="none" stroke="url(#ng2)" strokeWidth="9" strokeLinecap="round"/>
    <path d="M 33 26 Q 33 8 50 8 Q 67 8 67 26" fill="none" stroke="rgba(255,245,160,0.3)" strokeWidth="3" strokeLinecap="round"/>
    {/* G letter shadow */}
    <path d="M 66 46 A 20 20 0 1 0 66 76 L 66 64 L 53 64 L 53 70 L 60 70 A 12 12 0 1 1 60 52 L 66 52 Z" fill="rgba(0,0,0,0.2)" transform="translate(1,1)" />
    {/* G letter */}
    <path d="M 66 46 A 20 20 0 1 0 66 76 L 66 64 L 53 64 L 53 70 L 60 70 A 12 12 0 1 1 60 52 L 66 52 Z" fill="rgba(255,255,255,0.95)" filter="url(#nglow)" />
    {/* Hair flowing back */}
    <path d="M 36 56 Q 28 46 32 38 Q 36 30 44 31 Q 51 30 54 38" fill="url(#ng2)" opacity="0.92"/>
    {/* Face oval */}
    <ellipse cx="43" cy="60" rx="7" ry="9.5" fill="url(#ng1)" opacity="0.88"/>
    {/* Chin */}
    <path d="M 36 64 Q 37 72 43 74 Q 49 72 50 64" fill="url(#ng1)" opacity="0.70"/>
    {/* Hair strand right */}
    <path d="M 54 38 Q 59 46 56 57 Q 54 63 53 70" fill="url(#ng2)" opacity="0.80"/>
    {/* Shine on bag */}
    <ellipse cx="28" cy="42" rx="10" ry="5" fill="rgba(255,255,210,0.13)" transform="rotate(-18,28,42)"/>
    {/* GAURANGI text */}
    <text x="50" y="113" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10.5" fontWeight="700" letterSpacing="3" fill="url(#ntxt)" filter="url(#nsh)">GAURANGI</text>
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
