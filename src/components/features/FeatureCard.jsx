import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FeatureCard = ({ title, icon, children }) => {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: '1px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(55, 65, 81, 0.8)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        width: '300px',
        height: '400px',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        overflow: 'hidden'
      }}
    >
      {/* Corner Icons */}
      <div style={{ position: 'absolute', top: '-12px', left: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', top: '-12px', right: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', bottom: '-12px', left: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>
      <div style={{ position: 'absolute', bottom: '-12px', right: '-12px', color: '#10b981', fontSize: '24px' }}>+</div>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', zIndex: 20, textAlign: 'center' }}>
        <motion.div
          animate={{
            y: hovered ? -16 : 0,
            opacity: hovered ? 0 : 1
          }}
          transition={{ duration: 0.2 }}
          style={{ marginBottom: '1rem' }}
        >
          {icon}
        </motion.div>
        <motion.h2
          animate={{
            opacity: hovered ? 1 : 0,
            y: hovered ? -8 : 0,
            color: hovered ? '#ffffff' : '#10b981'
          }}
          transition={{ duration: 0.2 }}
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#10b981',
            margin: 0,
            textShadow: hovered ? '0 0 10px rgba(255, 255, 255, 0.5)' : 'none'
          }}
        >
          {title}
        </motion.h2>
      </div>
    </div>
  );
};

export default FeatureCard;

