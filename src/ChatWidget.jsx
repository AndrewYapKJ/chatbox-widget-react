import React, { useState, useEffect, useRef } from 'react';

const ChatWidget = () => {
  // Config from window (set by embed script)
  const config = window.ChatbotConfig || {};
  const apiUrl = config.apiUrl || 'https://bx22azxigm5zpxxovu7gwq4n6q0uzrup.lambda-url.ap-southeast-1.on.aws';
  const botName = config.botName || 'Assistant';
  const primaryColor = config.primaryColor || '#007bff';
  const greeting = config.greeting || 'Hello! How can I help you today?';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: greeting, sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = { text: input.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });

      if (!res.ok) throw new Error('Network error');

      const data = await res.json();
      const botMsg = { text: data.reply || 'Thanks!', sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, {
        text: 'Sorry, I am having trouble connecting. Please try again.',
        sender: 'bot'
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '64px',
          height: '64px',
          background: `linear-gradient(135deg, ${primaryColor} 60%, #4f8cff 100%)`,
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(0,0,0,0.18)',
          zIndex: 9999,
          transition: 'transform 0.18s cubic-bezier(.4,2,.6,1), box-shadow 0.18s',
          border: '3px solid #fff',
        }}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.22)';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.18)';
        }}
        aria-label="Open chat"
      >
        {/* Chat Icon SVG */}
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.08)" />
          <path d="M8 22V10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H12l-4 4z" fill="white"/>
          <circle cx="13" cy="16" r="1.2" fill={primaryColor} />
          <circle cx="16" cy="16" r="1.2" fill={primaryColor} />
          <circle cx="19" cy="16" r="1.2" fill={primaryColor} />
        </svg>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '360px',
            height: '520px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ background: primaryColor, color: 'white', padding: '16px', fontWeight: '600' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{botName}</span>
              <span onClick={() => setIsOpen(false)} style={{ cursor: 'pointer', fontSize: '24px', lineHeight: '1' }}>×</span>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#f8f9fa' }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '18px',
                    background: msg.sender === 'user' ? primaryColor : '#ffffff',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div style={{ display: 'flex' }}>
                <div style={{ background: '#fff', padding: '10px 14px', borderRadius: '18px' }}>
                  <span style={{ color: '#888' }}>typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', background: 'white', borderTop: '1px solid #eee' }}>
            <div style={{ display: 'flex' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  border: '1px solid #ddd',
                  borderRadius: '24px',
                  outline: 'none',
                  fontSize: '15px',
                }}
              />
              <button
                onClick={sendMessage}
                disabled={isTyping}
                style={{
                  marginLeft: '8px',
                  width: '44px',
                  height: '44px',
                  background: primaryColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;