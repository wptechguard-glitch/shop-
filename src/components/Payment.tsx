import React, { useState, useEffect } from "react";
import { FiCreditCard, FiSmartphone, FiTruck, FiLock, FiAlertCircle, FiXCircle } from "react-icons/fi";
import { API_BASE_URL } from "../api";
import "../index.css";

interface PaymentProps {
  totalAmount: number;
  cartItems: { id: string | number; name: string; price: number; qty: number }[];
  address: any;
  authToken: string | null;
  onNavigate: (page: string) => void;
  onPaymentSuccess: (order: any) => void;
}

// Dynamically load external scripts (Razorpay Checkout)
const loadScript = (src: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment: React.FC<PaymentProps> = ({
  totalAmount,
  cartItems,
  address,
  authToken,
  onNavigate,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentFailed, setPaymentFailed] = useState(false);
  const [isCodEnabled, setIsCodEnabled] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/config`);
        if (response.ok) {
          const data = await response.json();
          setIsCodEnabled(data.isCodEnabled);
        }
      } catch (err) {
        console.error("Failed to fetch COD configuration:", err);
      }
    };
    fetchConfig();
  }, []);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const methodLabel = method === "card" ? "Credit/Debit Card" : method === "upi" ? "UPI" : "Cash on Delivery";

    try {
      if (method === "cod") {
        // Cash on Delivery bypasses Razorpay
        const response = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            items: cartItems,
            total: totalAmount,
            address,
            paymentMethod: methodLabel,
            mode: "cod",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to place COD order");
        }

        onPaymentSuccess(data.order);
        return;
      }

      // Online payment: Load Razorpay
      const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
      if (!res) {
        throw new Error("Unable to load Razorpay script. Please check your internet connection.");
      }

      // 1. Create Payment Order on Backend
      const orderResponse = await fetch(`${API_BASE_URL}/orders/payment-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ totalAmount }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.message || "Failed to initialize payment order");
      }

      if (orderData.mode === "live") {
        // 2. Open Razorpay live payment widget
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Gaurangi",
          description: "Ethnic Wear Shopping Checkout",
          order_id: orderData.orderId,
          theme: { color: "#2d1b4e" }, // Dark premium navy theme color
          prefill: {
            name: address?.fullName || "",
            email: "",
            contact: address?.phone || "",
          },
          handler: async (paymentRes: any) => {
            setLoading(true);
            try {
              // 3. Verify Payment on Backend
              const verifyResponse = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: paymentRes.razorpay_order_id,
                  razorpay_payment_id: paymentRes.razorpay_payment_id,
                  razorpay_signature: paymentRes.razorpay_signature,
                  items: cartItems,
                  total: totalAmount,
                  address,
                  paymentMethod: methodLabel,
                  mode: "live",
                }),
              });

              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok) {
                throw new Error(verifyData.message || "Payment verification failed");
              }

              onPaymentSuccess(verifyData.order);
            } catch (err: any) {
              setError(err.message || "Payment verification failed");
              setPaymentFailed(true);
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setError("Payment checkout window was closed by user.");
              setPaymentFailed(true);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Simulated payment testing flow if no active keys
        console.log("Simulating online transaction...");
        setTimeout(async () => {
          try {
            const verifyResponse = await fetch(`${API_BASE_URL}/orders/verify-payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
              body: JSON.stringify({
                razorpay_order_id: orderData.orderId,
                razorpay_payment_id: `pay_mock_${Date.now()}`,
                items: cartItems,
                total: totalAmount,
                address,
                paymentMethod: methodLabel,
                mode: "test",
              }),
            });

            const verifyData = await verifyResponse.json();
            if (!verifyResponse.ok) {
              throw new Error(verifyData.message || "Simulated payment failed");
            }

            onPaymentSuccess(verifyData.order);
          } catch (err: any) {
            setError(err.message || "Simulated payment failed");
            setPaymentFailed(true);
            setLoading(false);
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected payment error occurred");
      setPaymentFailed(true);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        <div className="checkout-step done" onClick={() => onNavigate("checkout")}>
          1. Address
        </div>
        <div className="checkout-step-line done" />
        <div className="checkout-step active">2. Payment</div>
        <div className="checkout-step-line" />
        <div className="checkout-step">3. Confirmation</div>
      </div>

      <div className="checkout-layout">
        {paymentFailed ? (
          <div className="checkout-form-card payment-card failed-card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <div style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#ffebee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px auto"
            }}>
              <FiXCircle size={40} color="#e53935" />
            </div>
            <h2 style={{ color: "#e53935", marginBottom: "10px" }}>Payment Failed or Cancelled</h2>
            <p className="auth-sub" style={{ maxWidth: "400px", margin: "0 auto 24px auto", lineHeight: "1.6" }}>
              {error || "Your transaction was not completed. If any amount was debited, it will be automatically refunded within 3-5 business days."}
            </p>
            <div style={{ display: "flex", gap: "16px", justifyContent: "center" }}>
              <button
                type="button"
                className="auth-btn"
                style={{ width: "auto", padding: "12px 28px", margin: 0, background: "#14213d", color: "white" }}
                onClick={() => {
                  setPaymentFailed(false);
                  setError("");
                }}
              >
                Try Again
              </button>
              <button
                type="button"
                className="auth-btn"
                style={{ width: "auto", padding: "12px 28px", margin: 0, background: "#7a7371", color: "white" }}
                onClick={() => onNavigate("cart")}
              >
                Back to Cart
              </button>
            </div>
          </div>
        ) : (
          <div className="checkout-form-card payment-card">
            <h2>Payment Method</h2>
            <p className="auth-sub">Secure Checkout — Total Amount: ₹{totalAmount}</p>

          <div className="method-toggle">
            <button
              type="button"
              className={method === "card" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("card")}
              disabled={loading}
            >
              <FiCreditCard className="icon" /> Card (Roxpay)
            </button>
            <button
              type="button"
              className={method === "upi" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("upi")}
              disabled={loading}
            >
              <FiSmartphone className="icon" /> UPI (Roxpay)
            </button>
            {isCodEnabled ? (
              <button
                type="button"
                className={method === "cod" ? "toggle-btn active" : "toggle-btn"}
                onClick={() => setMethod("cod")}
                disabled={loading}
              >
                <FiTruck className="icon" /> Cash on Delivery
              </button>
            ) : (
              <button
                type="button"
                className="toggle-btn disabled-btn"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
                disabled={true}
                title="Cash on Delivery is temporarily disabled by admin"
              >
                <FiTruck className="icon" style={{ marginRight: "8px" }} /> COD (Disabled)
              </button>
            )}
          </div>

          <form onSubmit={handlePay}>
            {method === "card" && (
              <div className="slide-in">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Name on Card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-row">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="CVV"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
            )}

            {method === "upi" && (
              <div className="input-group slide-in">
                <input
                  type="text"
                  placeholder="VPA / UPI ID (e.g. name@upi)"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
            )}

            {method === "cod" && (
              <div className="cod-note slide-in">
                <FiAlertCircle className="note-icon" />
                <p>
                  Pay in cash when your order is delivered to your doorstep. A small
                  delivery convenience fee may apply depending on your location.
                </p>
              </div>
            )}

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn" disabled={loading}>
              <FiLock className="lock-icon" />
              {loading
                ? "Processing transaction..."
                : method === "cod"
                ? "Place Cash Order"
                : `Pay ₹${totalAmount} via Roxpay`}
            </button>
          </form>
        </div>
        )}

        <div className="checkout-summary-card">
          <h4>Order Summary</h4>
          <div className="price-detail-row">
            <span>Total Amount</span>
            <span>₹{totalAmount}</span>
          </div>
          <div className="price-detail-divider" />
          <div className="price-detail-row total-row">
            <span>Amount Payable</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;