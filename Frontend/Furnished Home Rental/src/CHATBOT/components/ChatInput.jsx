import React from "react";

const ChatInput = ({
  onSend,
  disabled,
  value,
  onChange,
  style,
  children // Accept children for icons
}) => (
  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
    <input
      type="text"
      className="chatbot-input"
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ ...style, flex: 1 }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSend(value);
        }
      }}
      placeholder="Type your message..."
    />
    {/* Render children (e.g., VoiceChatButton) */}
    {children}
    <button
      onClick={() => onSend(value)}
      disabled={disabled}
      style={{
        background: "#4caf50",
        border: "none",
        borderRadius: "50%",
        width: 40,
        height: 40,
        marginLeft: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer"
      }}
      title="Send"
      type="button"
    >
      <svg width="20" height="20" fill="#fff" viewBox="0 0 24 24">
        <path d="M2 21l21-9-21-9v7l15 2-15 2z" />
      </svg>
    </button>
  </div>
);

export default ChatInput;
