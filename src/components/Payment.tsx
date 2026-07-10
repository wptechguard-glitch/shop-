import React, { useState } from "react";
import { FiCreditCard, FiSmartphone, FiTruck } from "react-icons/fi";
import "../index.css";

interface PaymentProps {
  totalAmount: number;
  onNavigate?: (page: string) => void;
  onPlaceOrder: (method: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ totalAmount, onPlaceOrder }) => {
  const [method, setMethod] = useState<"card" | "upi" | "cod">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const methodLabel = method === "card" ? "Credit/Debit Card" : method === "upi" ? "UPI" : "Cash on Delivery";
    setLoading(true);
    try {
      await onPlaceOrder(methodLabel);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        <div className="checkout-step done">1. Address</div>
        <div className="checkout-step-line done" />
        <div className="checkout-step active">2. Payment</div>
        <div className="checkout-step-line" />
        <div className="checkout-step">3. Confirmation</div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card payment-card">
          <h2>Payment Method</h2>
          <p className="auth-sub">Total Amount: ₹{totalAmount}</p>

          <div className="method-toggle">
            <button
              type="button"
              className={method === "card" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("card")}
            >
              <FiCreditCard className="icon" /> Card
            </button>
            <button
              type="button"
              className={method === "upi" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("upi")}
            >
              <FiSmartphone className="icon" /> UPI
            </button>
            <button
              type="button"
              className={method === "cod" ? "toggle-btn active" : "toggle-btn"}
              onClick={() => setMethod("cod")}
            >
              <FiTruck className="icon" /> Cash on Delivery
            </button>
          </div>

          <form onSubmit={handlePay}>
            {method === "card" && (
              <>
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Card Number"
                    maxLength={16}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
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
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            {method === "upi" && (
              <div className="input-group">
                <input
                  type="text"
                  placeholder="yourname@upi"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
            )}

            {method === "cod" && (
              <p className="cod-note">
                Pay in cash when your order is delivered to your doorstep. A small
                convenience fee may apply depending on your location.
              </p>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? "Processing..." : method === "cod" ? "Place Order" : `Pay ₹${totalAmount}`}
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
            <span>To Pay</span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;