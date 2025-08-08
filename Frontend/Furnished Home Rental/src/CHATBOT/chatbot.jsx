import React, { useState } from "react";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotContainer from "./components/ChatbotContainer";
import "./chatbotAPI/styles/chatbot.css";

const Chatbot = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ChatbotButton onClick={() => setOpen(true)} />
      {open && <ChatbotContainer onClose={() => setOpen(false)} />}
    </>
  );
};


export default Chatbot;
