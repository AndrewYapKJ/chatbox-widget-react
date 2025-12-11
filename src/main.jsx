import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ChatWidget from './ChatWidget.jsx'


// Expose a global init function for ChatWidget
window.ChatWidget = {
  init: function (containerId = "chat-widget") {
    const el = document.getElementById(containerId);
    if (!el) {
      console.error("ChatWidget: container not found:", containerId);
      return;
    }
    const root = createRoot(el);
    root.render(
      <StrictMode>
        <ChatWidget />
      </StrictMode>
    );
  }
};

// Optional: auto-init if #chat-widget exists
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("chat-widget")) {
    window.ChatWidget.init("chat-widget");
  }
});
