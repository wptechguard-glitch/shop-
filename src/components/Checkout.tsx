import React, { useState } from "react";
import { FiMapPin, FiUser, FiPhone, FiHome } from "react-icons/fi";

export interface Address {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

interface CheckoutProps {
  totalAmount: number;
  onNavigate: (page: string) => void;
  onPlaceAddress: (address: Address) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ totalAmount, onNavigate, onPlaceAddress }) => {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState("");

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !addressLine || !city || !state || !pincode) {
      setError("Please fill in all fields");
      return;
    }
    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    if (pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }
    setError("");
    onPlaceAddress({ fullName, phone, addressLine, city, state, pincode });
    onNavigate("payment");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-steps">
        <div className="checkout-step active">1. Address</div>
        <div className="checkout-step-line" />
        <div className="checkout-step">2. Payment</div>
        <div className="checkout-step-line" />
        <div className="checkout-step">3. Confirmation</div>
      </div>

      <div className="checkout-layout">
        <div className="checkout-form-card">
          <h2><FiMapPin /> Delivery Address</h2>
          <p className="auth-sub">Enter the address where you want your order delivered</p>

          <form onSubmit={handleContinue}>
            <label className="field-label">Full Name</label>
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <label className="field-label">Phone Number</label>
            <div className="input-group">
              <FiPhone className="input-icon" />
              <input
                type="tel"
                placeholder="10-digit mobile number"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <label className="field-label">Address</label>
            <div className="input-group">
              <FiHome className="input-icon" />
              <input
                type="text"
                placeholder="House no, street, area"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
              />
            </div>

            <div className="input-row">
              <div style={{ flex: 1 }}>
                <label className="field-label">City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="field-label">State</label>
                <input
                  type="text"
                  placeholder="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>

            <label className="field-label">Pincode</label>
            <div className="input-group">
              <input
                type="text"
                placeholder="6-digit pincode"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-btn">Continue to Payment</button>
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

export default Checkout;
