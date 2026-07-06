import React, { useState } from "react";
import { FiCreditCard, FiSmartphone, FiCheckCircle } from "react-icons/fi";
import "../index.css";

interface PaymentProps {
  totalAmount: number;
  onNavigate: (page: string) => void;
}

const Payment: React.FC<PaymentProps> = ({ totalAmount, onNavigate }) => {
  const [method, setMethod] = useState<"card" | "upi">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    // Yahan real gateway (Razorpay/Stripe) ka checkout call hoga backend se
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card success-card">
          <FiCheckCircle className="success-icon" />
          <h2>Payment Successful</h2>
          <p>Aapka order confirm ho gaya hai.</p>
          <button className="auth-btn" onClick={() => onNavigate("home")}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card payment-card">
        <h2>Payment</h2>
        <p className="auth-sub">Total Amount: ₹{totalAmount}</p>

        <div className="method-toggle">
          <button
            className={method === "card" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setMethod("card")}
          >
            <FiCreditCard className="icon" /> Card
          </button>
          <button
            className={method === "upi" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setMethod("upi")}
          >
            <FiSmartphone className="icon" /> UPI
          </button>
        </div>

        <form onSubmit={handlePay}>
          {method === "card" ? (
            <>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Card Number"
                  maxLength={16}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name on Card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                />
              </div>
              <div className="input-row">
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="CVV"
                  maxLength={3}
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="input-group">
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
              />
            </div>
          )}

          <button type="submit" className="auth-btn">Pay ₹{totalAmount}</button>
        </form>
      </div>
    </div>
  );
};

export default Payment;