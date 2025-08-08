import React from "react";

const ChatbotButton = ({ onClick }) => (
  <button className="chatbot-float-btn" onClick={onClick} title="Chat with us!">
    <i className="fas fa-comments"></i>
  </button>
);

export default ChatbotButton;
