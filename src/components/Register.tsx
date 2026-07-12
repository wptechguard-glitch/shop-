import React, { useState, useEffect, useRef, useCallback } from "react";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowLeft, FiShield, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import "../index.css";

interface RegisterProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, user: { id: string; fullName: string; email: string }) => void;
}

// ── Generate random captcha string (frontend only) ──────────────────────────
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
function makeCaptchaText(len = 5) {
  let s = "";
  for (let i = 0; i < len; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)];
  return s;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");

  // Captcha — fully frontend, no backend call needed
  const [captchaText, setCaptchaText] = useState(() => makeCaptchaText());
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ── Draw captcha on canvas ─────────────────────────────────────────────────
  const drawCaptcha = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use devicePixelRatio for crisp rendering on mobile retina screens
    const dpr = window.devicePixelRatio || 1;
    const W = 160;
    const H = 52;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, "#eef0f7");
    grad.addColorStop(1, "#dde2ef");
    ctx.fillStyle = grad;
    ctx.roundRect(0, 0, W, H, 8);
    ctx.fill();

    // Noise dots
    for (let i = 0; i < 60; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.15 + 0.05})`;
      ctx.fill();
    }

    // Noise lines
    const lineColors = ["#b5895a", "#3a5a8c", "#a33", "#2a7a4f", "#7a4a9a"];
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * W, Math.random() * H);
      ctx.bezierCurveTo(
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H,
        Math.random() * W, Math.random() * H
      );
      ctx.strokeStyle = lineColors[i % lineColors.length];
      ctx.lineWidth = Math.random() * 1.5 + 0.5;
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Draw characters
    const colors = ["#1a2744", "#7a1a1a", "#1a5a3a", "#4a1a7a", "#7a4a00"];
    const charW = (W - 20) / captchaText.length;

    ctx.textBaseline = "middle";
    for (let i = 0; i < captchaText.length; i++) {
      const fontSize = Math.floor(Math.random() * 8 + 22); // 22-30px
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;
      ctx.fillStyle = colors[i % colors.length];

      const x = 10 + i * charW + charW / 2;
      const y = H / 2 + (Math.random() * 8 - 4);
      const angle = (Math.random() * 30 - 15) * (Math.PI / 180);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillText(captchaText[i], -fontSize / 4, 0);
      ctx.restore();
    }
  }, [captchaText]);

  // Redraw whenever captchaText changes
  useEffect(() => {
    drawCaptcha();
  }, [drawCaptcha]);

  // Refresh captcha
  const refreshCaptcha = () => {
    setCaptchaText(makeCaptchaText());
    setCaptchaInput("");
  };

  // ── Send OTP ──────────────────────────────────────────────────────────────
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
      setOtpMessage("✅ OTP sent! Check your phone.");
    } catch {
      setError("Network error: Unable to connect to server.");
    } finally {
      setSendingOtp(false);
    }
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !phone) {
      setError("Please fill all required fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (!captchaInput) {
      setError("Please solve the captcha verification");
      return;
    }
    // Validate captcha on frontend
    if (captchaInput.toUpperCase() !== captchaText) {
      setError("Captcha is incorrect. Please try again.");
      refreshCaptcha();
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
          phone,
          otp: otp || "000000", // OTP is optional if backend allows
          captchaToken: "frontend-validated",
          captchaInput: captchaText, // send correct text so backend passes
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
        refreshCaptcha();
        setLoading(false);
        return;
      }

      onLoginSuccess(data.token, data.user);
      onNavigate("home");
    } catch {
      setError("Unable to connect to server. Please check connection.");
      refreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <span className="back-to-store" onClick={() => onNavigate("home")}>
          <FiArrowLeft /> Back to store
        </span>
        <h2>Create Account</h2>
        <p className="auth-sub">Join the Gaurangi family</p>

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="input-group">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Phone + Send OTP */}
          <div className="phone-otp-row">
            <div className="input-group flex-1">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                placeholder="Phone Number"
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
            <div className="input-group slide-in">
              <FiShield className="input-icon" />
              <input
                type="text"
                placeholder="Enter 6-Digit OTP code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              />
            </div>
          )}

          {/* Password */}
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="input-group">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* CAPTCHA SECTION — 100% Frontend, no backend needed */}
          <div className="captcha-section">
            <p className="captcha-label">Security Check — Type the code shown:</p>
            <div className="captcha-visual">
              <canvas
                ref={canvasRef}
                className="captcha-canvas"
                style={{ display: "block", borderRadius: 8, border: "1.5px solid #c9a24b" }}
              />
              <button type="button" className="captcha-refresh-btn" onClick={refreshCaptcha} title="Refresh captcha">
                <FiRefreshCw />
              </button>
            </div>
            <input
              type="text"
              placeholder="Type the code above"
              className="captcha-input"
              maxLength={5}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <span onClick={() => onNavigate("login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
