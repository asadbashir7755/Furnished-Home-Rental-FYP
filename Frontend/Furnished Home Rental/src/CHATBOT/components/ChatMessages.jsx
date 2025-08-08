import React from "react";

const ChatMessages = ({ messages, loading, messagesEndRef }) => (
  <div className="chatbot-messages">
    {messages.map((msg, idx) => (
      <div
        key={idx}
        className={`chatbot-message ${msg.from === "user" ? "user" : "bot"}`}
      >
        {msg.text}
      </div>
    ))}
    {loading && (
      <div className="chatbot-message bot">
        <span className="chatbot-typing">
          <span></span><span></span><span></span>
        </span>
      </div>
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default ChatMessages;
