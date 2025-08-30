import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AuroraBackground } from '../components/ui/aurora-background';
import FeatureCards from '../components/features/FeatureCards';

const Landing = () => {
  const [globalHovered, setGlobalHovered] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <AuroraBackground>
        <div style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ 
              position: 'relative', 
              zIndex: 10, 
              textAlign: 'center', 
              width: '100%', 
              maxWidth: '1200px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            {/* Simple Header */}
            <motion.h1
              variants={itemVariants}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: '1rem',
                textAlign: 'center'
              }}
            >
              Elevate Your Game
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={itemVariants}
              style={{
                color: '#e5e7eb',
                fontSize: '1.25rem',
                marginBottom: '3rem',
                maxWidth: '600px',
                textAlign: 'center'
              }}
            >
              Transform handwritten scorecards into intelligent insights
            </motion.p>

            {/* Feature Cards */}
            <div style={{ marginBottom: '3rem' }}>
              <FeatureCards 
                globalHovered={globalHovered} 
                setGlobalHovered={setGlobalHovered} 
              />
            </div>

            {/* Simple CTA Button */}
            <motion.div
              variants={itemVariants}
            >
              <motion.button
                style={{
                  background: 'linear-gradient(135deg, #00bfff, #66ffb2)',
                  color: '#000000',
                  padding: '1rem 2rem',
                  borderRadius: '2rem',
                  border: 'none',
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 10px 25px rgba(0, 191, 255, 0.3)'
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 15px 35px rgba(102, 255, 178, 0.4)'
                }}
                whileTap={{ scale: 0.98 }}
              >
                Launch Analytics
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </AuroraBackground>
    </div>
  );
};

export default Landing;


