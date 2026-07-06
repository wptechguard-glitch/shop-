import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (email: string) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    setError("");
    onLoginSuccess(email);
    onNavigate("home");
  };

  const handleAutofill = () => {
    setEmail("admin@shopkart.com");
    setPassword("password123");
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

            <button type="submit" className="auth-btn">SIGN IN</button>
          </form>

          <div className="demo-box">
            <div>
              <span className="demo-label">DEMO ACCOUNT</span>
              <p>admin@shopkart.com / password123</p>
            </div>
            <button className="autofill-btn" onClick={handleAutofill}>
              AUTO-FILL
            </button>
          </div>

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