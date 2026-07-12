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
        {/* Logo Image + Brand Name */}
        <div className="store-name" onClick={() => onNavigate("home")}>
          <img
            src="/gaurangi-logo.jpg"
            alt="Gaurangi Logo"
            className="navbar-logo-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
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
