import React, { useState, useRef, useEffect } from "react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import VoiceChatButton from "./VoiceChatButton";
import { sendMessageToBot } from "../chatbotAPI/charbotAPI";

const ChatbotContainer = ({ onClose }) => {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(""); // Always a string
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (msg) => {
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInputValue(""); // Clear input after send
    setLoading(true);
    try {
      const res = await sendMessageToBot(msg);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: res?.reply || "Sorry, I didn't get that." }
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Oops! Something went wrong." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chatbot-modal">
      <div className="chatbot-header">
        <span>Furnished Home Assistant</span>
        <button className="chatbot-close-btn" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      <ChatMessages messages={messages} loading={loading} messagesEndRef={messagesEndRef} />
      <div className="chatbot-input-area" style={{ display: "flex", alignItems: "center", padding: "8px" }}>
        <ChatInput
          onSend={handleSend}
          disabled={loading}
          value={inputValue || ""}
          onChange={e => setInputValue(e.target.value || "")}
          style={{ flex: 1, marginRight: 8 }}
        >
          <VoiceChatButton
            setInputValue={setInputValue}
            getInputValue={() => inputValue || ""}
          />
        </ChatInput>
      </div>
    </div>
  );
};

export default ChatbotContainer;
