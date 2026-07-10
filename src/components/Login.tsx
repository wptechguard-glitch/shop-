import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { API_BASE_URL } from "../api";

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, user: { id: string; fullName: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      onLoginSuccess(data.token, data.user);
      onNavigate("home");
    } catch (err) {
      setError("Unable to connect to server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-brand-panel">
        <div className="auth-brand-decor" />
        <span className="brand-badge">✨ TRADITIONAL WEAR</span>
        <h1>
          Welcome to<br />
          <span>ShopKart</span>
        </h1>
        <p>
          Your destination for premium ethnic kurtis, traditional salwar
          suits, and handcrafted designer sarees.
        </p>
        <div className="brand-stats">
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>5K+</h3>
            <p>Kurtis & Sarees</p>
          </div>
          <div className="stat-item">
            <h3>4.8★</h3>
            <p>Store Rating</p>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-card">
          <span className="back-to-store" onClick={() => onNavigate("home")}>
            <FiArrowLeft /> Back to store
          </span>

          <h2>Welcome Back</h2>
          <p className="auth-sub">Sign in to your ShopKart account</p>

          <form onSubmit={handleSubmit}>
            <label className="field-label">Email Address</label>
            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="label-row">
              <label className="field-label">Password</label>
              <span className="forgot-link">Forgot password?</span>
            </div>
            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="input-icon-right"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <label className="remember-me">
              <input type="checkbox" />
              Keep me signed in
            </label>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="auth-switch">
            New to ShopKart? <span onClick={() => onNavigate("register")}>Create Account</span>
          </p>

          <p className="terms-text">
            By continuing, you agree to our Terms of Service & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
