import React from 'react';
import { motion } from 'framer-motion';

export const WavyBackground = ({ children, className = "" }) => {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Wavy Background */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Base gradient */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #000000 0%, #1f2937 50%, #000000 100%)'
          }}
        />
        
        {/* Animated Waves - Now Green Golf Course Hills */}
        <svg
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          {/* Wave 1 - Dark Green Hills */}
          <motion.path
            d="M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z"
            fill="rgba(16, 85, 16, 0.3)"
            animate={{
              d: [
                "M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z",
                "M0,450 C360,350 720,550 1440,450 L1440,800 L0,800 Z",
                "M0,400 C360,300 720,500 1440,400 L1440,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Wave 2 - Medium Green Hills */}
          <motion.path
            d="M0,500 C360,400 720,600 1440,500 L1440,800 L0,800 Z"
            fill="rgba(34, 139, 34, 0.25)"
            animate={{
              d: [
                "M0,500 C360,400 720,600 1440,500 L1440,800 L0,800 Z",
                "M0,520 C360,420 720,620 1440,520 L1440,800 L0,800 Z",
                "M0,500 C360,400 720,600 1440,500 L1440,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Wave 3 - Light Green Hills */}
          <motion.path
            d="M0,600 C360,500 720,700 1440,600 L1440,800 L0,800 Z"
            fill="rgba(102, 255, 178, 0.15)"
            animate={{
              d: [
                "M0,600 C360,500 720,700 1440,600 L1440,800 L0,800 Z",
                "M0,580 C360,480 720,680 1440,580 L1440,800 L0,800 Z",
                "M0,600 C360,500 720,700 1440,600 L1440,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
        
        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '3px',
              height: '3px',
              backgroundColor: i % 2 === 0 ? '#00bfff' : '#66ffb2',
              borderRadius: '50%',
              opacity: 0.6,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
};
