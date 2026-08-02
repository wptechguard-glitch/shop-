import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import type { Order } from "../App";

interface SupportChatProps {
  orders: Order[];
}

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
}

const SupportChat: React.FC<SupportChatProps> = ({ orders }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to Gaurangi Customer Support. How can I help you today? 🌸",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [awaitingOrderId, setAwaitingOrderId] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const addBotMessage = (text: string) => {
    setMessages((prev) => [...prev, { sender: "bot", text, timestamp: new Date() }]);
  };

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: textToSend, timestamp: new Date() }]);
    setInput("");

    // Process Bot response after a small delay
    setTimeout(() => {
      const lower = textToSend.toLowerCase();

      if (awaitingOrderId) {
        setAwaitingOrderId(false);
        const cleanId = textToSend.trim().toUpperCase();
        const foundOrder = orders.find(
          (o) =>
            (o.orderId && o.orderId.toUpperCase() === cleanId) ||
            (o.id && o.id.toUpperCase() === cleanId) ||
            (o._id && o._id.toUpperCase() === cleanId)
        );

        if (foundOrder) {
          addBotMessage(
            `📦 Found your order! \n\n• Status: **${foundOrder.status}**\n• Date Placed: ${foundOrder.date}\n• Payment: ${foundOrder.paymentMethod}\n• Total Amount: ₹${foundOrder.total}`
          );
        } else {
          addBotMessage(
            `❌ Sorry, I couldn't find any order matching ID "${cleanId}" in your account. Please make sure the ID is correct or choose "Contact Support" below.`
          );
        }
        return;
      }

      if (lower.includes("track") || lower.includes("order")) {
        setAwaitingOrderId(true);
        addBotMessage("Please enter your Order ID (e.g., ORD12345678) to track your package status:");
      } else if (lower.includes("return") || lower.includes("refund") || lower.includes("policy")) {
        addBotMessage(
          "🔄 Return & Refund Policy:\n\nYou can return or exchange any item within 7 days of delivery. Items must be unused and in original packaging. Refunds are processed within 3-5 business days after product pickup."
        );
      } else if (lower.includes("delivery") || lower.includes("time") || lower.includes("ship")) {
        addBotMessage(
          "🚚 Delivery Times:\n\nStandard shipping takes 3-5 business days depending on your location. We will send an SMS dispatch alert once it leaves our warehouse."
        );
      } else if (lower.includes("agent") || lower.includes("contact") || lower.includes("call") || lower.includes("support")) {
        addBotMessage(
          "📞 Contact Customer Support:\n\nYou can email us directly at **support@gaurangi.in** or call our support helpline at **+91 99999-88888** (Mon-Sat, 10 AM to 6 PM)."
        );
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        addBotMessage("Hi there! How can I help you today? Please choose one of the quick options or ask a question.");
      } else if (lower.includes("thank")) {
        addBotMessage("You're welcome! Let me know if you need anything else. Happy shopping! 😊");
      } else {
        addBotMessage(
          "I'm not sure about that. Please choose one of the quick reply buttons below or contact our executive at support@gaurangi.in."
        );
      }
    }, 800);
  };

  const handleQuickAction = (action: string) => {
    handleSend(action);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #2d1b4e 0%, #14213d 100%)",
          color: "white",
          border: "none",
          boxShadow: "0 6px 20px rgba(45, 27, 78, 0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        title="Gaurangi Chat Support"
      >
        {isOpen ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "96px",
            right: "24px",
            width: "360px",
            height: "480px",
            borderRadius: "16px",
            background: "white",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            zIndex: 9999,
            border: "1px solid rgba(0,0,0,0.08)",
            fontFamily: "inherit",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              background: "linear-gradient(135deg, #2d1b4e 0%, #14213d 100%)",
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: "#34a853",
                  boxShadow: "0 0 8px #34a853",
                }}
              />
              <span style={{ fontWeight: 600, fontSize: "15px" }}>Gaurangi Assistant 🌸</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "white", cursor: "pointer" }}
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              background: "#f8f9fa",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.sender === "bot" ? "flex-start" : "flex-end",
                  maxWidth: "80%",
                  background: msg.sender === "bot" ? "white" : "#e2dcf2",
                  color: "#333",
                  padding: "10px 14px",
                  borderRadius: msg.sender === "bot" ? "12px 12px 12px 2px" : "12px 12px 2px 12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  fontSize: "13px",
                  lineHeight: "1.5",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Replies Options */}
          <div
            style={{
              padding: "10px 16px",
              background: "#fff",
              borderTop: "1px solid #eee",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <button
              onClick={() => handleQuickAction("Track my Order")}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid #b8a0d4",
                background: "#fdfbfe",
                color: "#2d1b4e",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              📦 Track Order
            </button>
            <button
              onClick={() => handleQuickAction("Return Policy")}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid #b8a0d4",
                background: "#fdfbfe",
                color: "#2d1b4e",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              🔄 Return Policy
            </button>
            <button
              onClick={() => handleQuickAction("Contact Support")}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "1px solid #b8a0d4",
                background: "#fdfbfe",
                color: "#2d1b4e",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              📞 Contact Support
            </button>
          </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            style={{
              display: "flex",
              borderTop: "1px solid #eee",
              padding: "8px 12px",
              alignItems: "center",
              background: "white",
            }}
          >
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: "13px",
                padding: "8px",
              }}
            />
            <button
              type="submit"
              style={{
                background: "none",
                border: "none",
                color: "#2d1b4e",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default SupportChat;
