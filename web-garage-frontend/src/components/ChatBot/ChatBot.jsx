import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react'; // 1. Import Maximize2
import styles from './ChatBot.module.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // <-- 1. Import ReactMarkdown
import remarkGfm from 'remark-gfm'; // <-- 2. Import remarkGfm
const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm EcoGuide, your sustainable living assistant. How can I help you today?",
      sender: 'bot'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // web-garage-frontend/src/components/ChatBot/ChatBot.jsx

// ... (keep the rest of your component the same)

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), text: inputMessage.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage.trim(); // Store the message before clearing the input
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get the JWT from local storage for authorization
      const token = localStorage.getItem('token');

      // Make a POST request to YOUR backend endpoint
      const response = await axios.post(
        'http://localhost:5000/api/chat',
        { message: currentInput }, // Send the user's message in the request body
        {
          headers: {
            'x-auth-token': token // Pass the token in the headers
          }
        }
      );

      // Create a bot message with the reply from the Gemini API
      const botMessage = { id: Date.now() + 1, text: response.data.reply, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { id: Date.now() + 1, text: "Sorry, I'm having a little trouble connecting right now. Please try again later.", sender: 'bot' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

// ... (keep the rest of your component the same)


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleToggleChat = () => {
    // If opening for the first time or from a closed state, ensure it's not minimized.
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
    } else {
      // If already open, just close it.
      setIsOpen(false);
    }
  };

  const handleMinimizeToggle = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={styles.floatingContainer}>
      {isOpen && (
        <div className={`${styles.chatContainer} ${isMinimized ? styles.minimized : ''}`}>
          <div className={styles.chatHeader}>
            <div className={styles.headerInfo}>
              <div className={styles.botIcon}>🌱</div>
              <div className={styles.headerText}>
                <h3>EcoGuide</h3>
                <p>{isLoading ? 'Typing...' : 'Online'}</p>
              </div>
            </div>
            <div className={styles.headerActions}>
              {/* --- 2. THIS IS THE FIX for the icon --- */}
              <button className={styles.headerBtn} onClick={handleMinimizeToggle}>
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button className={styles.headerBtn} onClick={handleToggleChat}>
                <X size={14} />
              </button>
            </div>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${msg.sender === 'user' ? styles.messageUser : styles.messageBot}`}
              >
                <div
                  className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={`${styles.message} ${styles.messageBot}`}>
                <div className={`${styles.messageBubble} ${styles.messageBubbleBot}`}>
                  <div className={styles.loadingMessage}>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                    <div className={styles.loadingDot}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className={styles.inputContainer}>
            <textarea
              className={styles.chatInput}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask EcoGuide anything..."
              disabled={isLoading}
              rows={1}
            />
            <button className={styles.sendBtn} onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
      <button className={styles.floatingButton} onClick={handleToggleChat}>
        {!isOpen && <div className={styles.pulse}></div>}
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default FloatingChatbot;
