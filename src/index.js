import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import ChatWidget from './ChatWidget';
import reportWebVitals from './reportWebVitals';

// Expose a global init function
window.ChatWidget = {
  init: function (containerId = "chat-widget") {
    const el = document.getElementById(containerId);
    if (!el) {
      console.error("ChatWidget: container not found:", containerId);
      return;
    }

    const root = ReactDOM.createRoot(el);
    root.render(
      <React.StrictMode>
        <ChatWidget />
      </React.StrictMode>
    );
  }
};

// Optional: auto-init if #chat-widget exists
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("chat-widget")) {
    window.ChatWidget.init("chat-widget");
  }
});

reportWebVitals();
