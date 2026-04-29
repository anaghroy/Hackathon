import React from 'react';
import { Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Loading component with high-end animations.
 * 
 * @param {Object} props
 * @param {boolean} props.fullScreen - Whether to show the loader in full screen overlay
 * @param {string} props.message - Custom message to display below the loader
 * @param {string} props.className - Additional class names
 */
const Loading = ({ fullScreen = false, message = "Processing...", className = "" }) => {
  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`loading-container ${fullScreen ? 'full-screen' : ''} ${className}`}
      >
        <div className="loader-wrapper">
          <div className="spinner-ring"></div>
          <motion.div 
            className="icon-pulse"
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          >
            <Code2 size={32} />
          </motion.div>
        </div>
        
        {message && (
          <motion.p 
            className="loading-text"
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
