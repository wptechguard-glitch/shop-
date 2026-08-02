import React, { useState, useRef, useEffect } from "react";
import { FiMessageCircle, FiX, FiSend } from "react-icons/fi";
import type { Order } from "../App";
import { API_BASE_URL } from "../api";

interface SupportChatProps {
  orders: Order[];
  currentUser: any;
}

interface Message {
  sender: "bot" | "user" | "admin";
  text: string;
  timestamp: Date;
}

const getGuestId = () => {
  let id = localStorage.getItem("gaurangi_chat_guest_id");
  if (!id) {
    id = "GUEST_" + Math.random().toString(36).substring(2, 9).toUpperCase();
    localStorage.setItem("gaurangi_chat_guest_id", id);
  }
  return id;
};

const SupportChat: React.FC<SupportChatProps> = ({ orders, currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Hello! Welcome to Gaurangi Customer Support. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [awaitingOrderId, setAwaitingOrderId] = useState(false);

  const userId = currentUser ? currentUser.id || currentUser._id : getGuestId();
  const userEmail = currentUser ? currentUser.email || currentUser.fullName : "Guest Customer";

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Sync / Polling effect
  useEffect(() => {
    if (!isOpen) return;

    const fetchChatMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/chats/my-chat/${userId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chat messages:", err);
      }
    };

    fetchChatMessages();
    const interval = setInterval(fetchChatMessages, 3000);
    return () => clearInterval(interval);
  }, [isOpen, userId]);

  const syncMessageToDb = async (sender: "user" | "bot", text: string) => {
    try {
      await fetch(`${API_BASE_URL}/chats/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userEmail, sender, text }),
      });
    } catch (err) {
      console.error("Failed to sync message to DB:", err);
    }
  };

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Add user message locally
    const userMsg: Message = { sender: "user", text: textToSend, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Sync user message to DB
    await syncMessageToDb("user", textToSend);

    // Process Bot response after a small delay
    setTimeout(async () => {
      const lower = textToSend.toLowerCase();
      let botReply = "";

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
          botReply = `Found your order! \n\n• Status: **${foundOrder.status}**\n• Date Placed: ${foundOrder.date}\n• Payment: ${foundOrder.paymentMethod}\n• Total Amount: ₹${foundOrder.total}`;
        } else {
          botReply = `Sorry, I couldn't find any order matching ID "${cleanId}" in your account. Please make sure the ID is correct or choose "Contact Support" below.`;
        }
      } else if (lower.includes("track") || lower.includes("order")) {
        setAwaitingOrderId(true);
        botReply = "Please enter your Order ID (e.g., ORD12345678) to track your package status:";
      } else if (lower.includes("return") || lower.includes("refund") || lower.includes("policy")) {
        botReply = "Return & Refund Policy:\n\nYou can return or exchange any item within 7 days of delivery. Items must be unused and in original packaging. Refunds are processed within 3-5 business days after product pickup.";
      } else if (lower.includes("delivery") || lower.includes("time") || lower.includes("ship")) {
        botReply = "Delivery Times:\n\nStandard shipping takes 3-5 business days depending on your location. We will send an SMS dispatch alert once it leaves our warehouse.";
      } else if (lower.includes("agent") || lower.includes("contact") || lower.includes("call") || lower.includes("support")) {
        botReply = "Contact Customer Support:\n\nYou can email us directly at **support@gaurangi.in** or call our support helpline at **+91 99999-88888** (Mon-Sat, 10 AM to 6 PM).";
      } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
        botReply = "Hi there! How can I help you today? Please choose one of the quick options or ask a question.";
      } else if (lower.includes("thank")) {
        botReply = "You're welcome! Let me know if you need anything else. Happy shopping!";
      } else {
        // Fallback responder requested by user
        botReply = "Our support team will get in touch with you shortly. Thank you for your patience!";
      }

      // Add bot message locally
      setMessages((prev) => [...prev, { sender: "bot", text: botReply, timestamp: new Date() }]);
      
      // Sync bot message to DB
      await syncMessageToDb("bot", botReply);
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
              <span style={{ fontWeight: 600, fontSize: "15px" }}>Gaurangi Assistant</span>
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
            {messages.map((msg, i) => {
              const isUser = msg.sender === "user";
              
              let bubbleBg = "#e2dcf2";
              let alignSelf = "flex-end";
              let label = "";

              if (msg.sender === "bot") {
                bubbleBg = "white";
                alignSelf = "flex-start";
              } else if (msg.sender === "admin") {
                bubbleBg = "#d1ecf1";
                alignSelf = "flex-start";
                label = "GAURANGI AGENT";
              }

              return (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignSelf }}>
                  {label && (
                    <span style={{ fontSize: "9px", color: "#17a2b8", fontWeight: 700, marginBottom: "3px", marginLeft: "4px" }}>
                      {label}
                    </span>
                  )}
                  <div
                    style={{
                      background: bubbleBg,
                      color: "#333",
                      padding: "10px 14px",
                      borderRadius: isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                      fontSize: "13px",
                      lineHeight: "1.5",
                      whiteSpace: "pre-line",
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
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
              Track Order
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
              Return Policy
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
              Contact Support
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
