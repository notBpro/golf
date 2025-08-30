import React from 'react';
import { motion } from 'framer-motion';

export const AuroraBackground = ({ children, className = "" }) => {
  return (
    <div 
      className={className}
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        width: '100%'
      }}
    >
      {/* Aurora Background Layers */}
      <div style={{ position: 'absolute', inset: 0 }}>
        {/* Base gradient */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)'
          }}
        />
        
        {/* Aurora Layer 1 */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.3,
            background: 'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(34, 197, 94, 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
          }}
          animate={{
            background: [
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(34, 197, 94, 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 40% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 60% 80%, rgba(16, 185, 129, 0.4) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 80% 40%, rgba(34, 197, 94, 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 20% 20%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 80% 50% at 20% 40%, rgba(34, 197, 94, 0.4) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Aurora Layer 2 */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.2,
            background: 'radial-gradient(ellipse 100% 60% at 50% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 30% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
          }}
          animate={{
            background: [
              'radial-gradient(ellipse 100% 60% at 50% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 30% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse 100% 60% at 20% 50%, rgba(20, 184, 166, 0.2) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 70% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%)',
              'radial-gradient(ellipse 100% 60% at 80% 80%, rgba(20, 184, 166, 0.3) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 50% 50%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse 100% 60% at 50% 20%, rgba(20, 184, 166, 0.3) 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 30% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)'
            ]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              backgroundColor: '#22c55e',
              borderRadius: '50%',
              opacity: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-15, 15, -15],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
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
