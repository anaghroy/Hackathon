import React, { useState, useEffect } from 'react';

const TypewriterText = ({ text, speed = 20, delay = 0, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Reset state when text changes
    setDisplayedText('');
    setIsTyping(false);
    setHasStarted(false);

    let startTimeout;
    let typingInterval;

    if (text) {
      startTimeout = setTimeout(() => {
        setHasStarted(true);
        setIsTyping(true);
        let currentIndex = 0;
        
        typingInterval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.substring(0, currentIndex));
            currentIndex += 2; // Type 2 characters at a time for smoother speed
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            if (onComplete) onComplete();
          }
        }, speed);
      }, delay);
    }

    return () => {
      clearTimeout(startTimeout);
      clearInterval(typingInterval);
    };
  }, [text, speed, delay, onComplete]);

  if (!hasStarted && delay > 0) {
    return <span style={{ opacity: 0 }}>{text}</span>;
  }

  return (
    <span className="ai-stream-text">
      {displayedText}
      {isTyping && <span className="ai-stream-cursor">|</span>}
    </span>
  );
};

export default TypewriterText;
