import React, { useState, useEffect, useRef } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft, FiPhone, FiShield, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import "../index.css";

interface LoginProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, user: { id: string; fullName: string; email: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onNavigate, onLoginSuccess }) => {
  const [loginMethod, setLoginMethod] = useState<"password" | "otp">("password");
  
  // Credentials states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  // View states
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  
  // Captcha states
  const [captchaText, setCaptchaText] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch captcha from backend
  const fetchCaptcha = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/captcha`);
      if (res.ok) {
        const data = await res.json();
        setCaptchaToken(data.captchaToken);
        setCaptchaText(data.captchaText);
      }
    } catch (err) {
      console.error("Failed to load captcha", err);
    }
  };

  // Draw Distorted Captcha on HTML5 Canvas
  useEffect(() => {
    if (captchaText && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background styled panel
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add line noise
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = ["#c9a24b", "#3a5a8c", "#c0392b", "#2f7a4f"][Math.floor(Math.random() * 4)];
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.stroke();
        }

        // Draw rotated characters
        ctx.font = "bold 26px 'Courier New', Courier, monospace";
        ctx.textBaseline = "middle";

        for (let i = 0; i < captchaText.length; i++) {
          ctx.fillStyle = ["#14213d", "#0d1526", "#1f1b1a"][Math.floor(Math.random() * 3)];
          const x = 20 + i * 22;
          const y = canvas.height / 2 + (Math.random() * 12 - 6);
          const angle = (Math.random() * 30 - 15) * Math.PI / 180;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);
          ctx.fillText(captchaText[i], -10, 0);
          ctx.restore();
        }
      }
    }
  }, [captchaText]);

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setError("");
    setSendingOtp(true);
    setOtpMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to send OTP. Please try again.");
        return;
      }

      setOtpSent(true);
      setOtpMessage("SMS OTP code generated! Please check backend logs/terminal.");
    } catch (err) {
      setError("Network error: Unable to connect to server.");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginMethod === "password" && (!email || !password)) {
      setError("Please enter both email and password");
      return;
    }

    if (loginMethod === "otp" && (!phone || !otp)) {
      setError("Please verify phone number and OTP code");
      return;
    }

    if (!captchaInput) {
      setError("Please type in captcha verification code");
      return;
    }

    setError("");
    setLoading(true);

    const payload = loginMethod === "password" 
      ? { email, password, captchaToken, captchaInput }
      : { phone, otp, captchaToken, captchaInput };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed. Please try again.");
        fetchCaptcha(); // reload captcha on failure
        setLoading(false);
        return;
      }

      onLoginSuccess(data.token, data.user);
      onNavigate("home");
    } catch (err) {
      setError("Unable to connect to server. Please check connection.");
      fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      <div className="auth-brand-panel">
        <div className="auth-brand-decor" />
        <span className="brand-badge">TRADITIONAL WEAR</span>
        <h1>
          Welcome to<br />
          <span>ShopKart</span>
        </h1>
        <p>
          Your destination for premium ethnic wear, traditional salwar
          suits, and handcrafted designer collections.
        </p>
        <div className="brand-stats">
          <div className="stat-item">
            <h3>Premium</h3>
            <p>Quality Fabrics</p>
          </div>
          <div className="stat-item">
            <h3>Designer</h3>
            <p>Handcrafts</p>
          </div>
          <div className="stat-item">
            <h3>4.8 Star</h3>
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
          <p className="auth-sub font-premium">Sign in to your ShopKart account</p>

          {/* LOGIN METHOD TOGGLE TABS */}
          <div className="auth-method-toggle">
            <button
              type="button"
              className={loginMethod === "password" ? "auth-toggle-tab active" : "auth-toggle-tab"}
              onClick={() => {
                setLoginMethod("password");
                setError("");
              }}
            >
              Password
            </button>
            <button
              type="button"
              className={loginMethod === "otp" ? "auth-toggle-tab active" : "auth-toggle-tab"}
              onClick={() => {
                setLoginMethod("otp");
                setError("");
              }}
            >
              OTP Login
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {loginMethod === "password" ? (
              <>
                <label className="field-label">Email Address</label>
                <div className="input-group">
                  <FiMail className="input-icon" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    required
                  />
                  <span
                    className="input-icon-right"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              </>
            ) : (
              <>
                <label className="field-label">Phone Number</label>
                <div className="phone-otp-row">
                  <div className="input-group flex-1">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      placeholder="10-digit number"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      disabled={otpSent}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="otp-send-btn"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !phone || phone.length !== 10}
                  >
                    {sendingOtp ? "Sending..." : otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>

                {otpMessage && <p className="otp-status-success">{otpMessage}</p>}

                {otpSent && (
                  <>
                    <label className="field-label">SMS Verification Code</label>
                    <div className="input-group slide-in">
                      <FiShield className="input-icon" />
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* CAPTCHA ROW */}
            <label className="field-label">Captcha Verification</label>
            <div className="captcha-section">
              <div className="captcha-visual">
                <canvas ref={canvasRef} width={130} height={44} className="captcha-canvas" />
                <button type="button" className="captcha-refresh-btn" onClick={fetchCaptcha}>
                  <FiRefreshCw />
                </button>
              </div>
              <input
                type="text"
                placeholder="Type code"
                className="captcha-input"
                maxLength={5}
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading || (loginMethod === "otp" && !otpSent)}>
              {loading ? "Signing in..." : "SIGN IN"}
            </button>
          </form>

          <p className="auth-switch">
            New to ShopKart? <span onClick={() => onNavigate("register")}>Create Account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
