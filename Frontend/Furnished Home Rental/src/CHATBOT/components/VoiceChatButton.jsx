import React, { useState, useRef, useEffect } from "react";

const VoiceChatButton = ({ setInputValue }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize speech recognition only once
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.log("Browser doesn't support speech recognition");
      return;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (setInputValue) {
        setInputValue(prev => (prev ? prev + " " : "") + transcript);
      }
    };

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onerror = () => setListening(false);
    recognitionRef.current.onend = () => {
      // Add a small delay to ensure onresult fires before onend
      setTimeout(() => setListening(false), 100);
    };

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []); // Empty dependency array - run only once

  const handleVoiceClick = () => {
    if (!recognitionRef.current) return;
    
    if (!listening) {
      // Start recognition
      recognitionRef.current.start();
    } else {
      // Stop recognition
      recognitionRef.current.stop();
    }
  };

  return (
    <button
      onClick={handleVoiceClick}
      style={{
        background: listening ? "#4caf50" : "#fff",
        border: "none",
        borderRadius: "50%",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: 48,
        height: 48,
        marginLeft: 12,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s"
      }}
      title={listening ? "Stop voice chat" : "Start voice chat"}
    >
      {listening ? (
        <span className="voice-spinner" style={{width: 24, height: 24, border: "3px solid #fff", borderTop: "3px solid #4caf50", borderRadius: "50%", animation: "spin 1s linear infinite"}} />
      ) : (
        <svg
          width="24"
          height="24"
          fill="#333"
          viewBox="0 0 24 24"
        >
          <path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.92V21a1 1 0 1 1-2 0v-2.08A7 7 0 0 1 5 12a1 1 0 1 1 2 0 5 5 0 0 0 10 0z"/>
        </svg>
      )}
    </button>
  );
};

export default VoiceChatButton;
