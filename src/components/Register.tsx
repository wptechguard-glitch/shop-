import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiMail, FiLock, FiPhone, FiArrowLeft, FiShield, FiRefreshCw } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import "../index.css";

interface RegisterProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (token: string, user: { id: string; fullName: string; email: string }) => void;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  
  // States for verification
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  
  // Captcha states
  const [captchaText, setCaptchaText] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
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
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background styled panel
        ctx.fillStyle = "#f3f4f6";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Distort background lines (noise lines)
        for (let i = 0; i < 6; i++) {
          ctx.strokeStyle = ["#c9a24b", "#3a5a8c", "#c0392b", "#2f7a4f"][Math.floor(Math.random() * 4)];
          ctx.lineWidth = Math.random() * 2 + 1;
          ctx.beginPath();
          ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
          ctx.stroke();
        }

        // Draw each captcha character with random offset and angle
        ctx.font = "bold 26px 'Courier New', Courier, monospace";
        ctx.textBaseline = "middle";

        for (let i = 0; i < captchaText.length; i++) {
          ctx.fillStyle = ["#14213d", "#0d1526", "#1f1b1a"][Math.floor(Math.random() * 3)];
          const x = 20 + i * 22;
          const y = canvas.height / 2 + (Math.random() * 12 - 6);
          const angle = (Math.random() * 30 - 15) * Math.PI / 180; // random rotate

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
    if (!otp) {
      setError("Please enter the verification OTP sent to your phone");
      return;
    }
    if (!captchaInput) {
      setError("Please solve the captcha verification");
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
          otp,
          captchaToken,
          captchaInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed. Please try again.");
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
    <div className="auth-wrapper">
      <div className="auth-card">
        <span className="back-to-store" onClick={() => onNavigate("home")}>
          <FiArrowLeft /> Back to store
        </span>
        <h2>Create Account</h2>
        <p className="auth-sub">Join the ShopKart family</p>

        <form onSubmit={handleSubmit}>
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
                required
              />
            </div>
          )}

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

          {/* CAPTCHA SECTION */}
          <div className="captcha-section">
            <div className="captcha-visual">
              <canvas ref={canvasRef} width={130} height={44} className="captcha-canvas" />
              <button type="button" className="captcha-refresh-btn" onClick={fetchCaptcha}>
                <FiRefreshCw />
              </button>
            </div>
            <input
              type="text"
              placeholder="Type code above"
              className="captcha-input"
              maxLength={5}
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading || (otpSent && !otp)}>
            {loading ? "Registering account..." : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <span onClick={() => onNavigate("login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Register;
