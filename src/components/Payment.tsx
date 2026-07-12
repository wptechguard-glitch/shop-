import React, { useState } from "react";
import { FiCreditCard, FiSmartphone, FiTruck, FiLock, FiAlertCircle } from "react-icons/fi";
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
          theme: { color: "#14213d" }, // Dark premium navy theme color
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
              setLoading(false);
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
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
            setLoading(false);
          }
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected payment error occurred");
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
            <button
              type="button"
              className={method === "cod" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("cod")}
              disabled={loading}
            >
              <FiTruck className="icon" /> Cash on Delivery
            </button>
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