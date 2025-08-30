import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BackgroundEffects from '../components/layout/BackgroundEffects';
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
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 50%, #374151 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Effects */}
      <BackgroundEffects />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', width: '100%', maxWidth: '1200px' }}
      >
        {/* Header */}
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
          Unlock Your Golf{" "}
          <motion.span
            animate={{
              color: globalHovered ? "#10b981" : "#ffffff",
              textShadow: globalHovered ? "0 0 20px #10b981" : "none"
            }}
            transition={{ duration: 0.3 }}
          >
            Potential
          </motion.span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            color: '#d1d5db',
            fontSize: '1.25rem',
            marginBottom: '4rem',
            maxWidth: '600px',
            margin: '0 auto 4rem auto'
          }}
        >
          Discover insights hidden in your scorecards
        </motion.p>

        {/* Feature Cards */}
        <FeatureCards 
          globalHovered={globalHovered} 
          setGlobalHovered={setGlobalHovered} 
        />

        {/* CTA */}
        <motion.div
          variants={itemVariants}
          style={{ marginTop: '4rem' }}
        >
          <motion.button
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              border: 'none',
              fontSize: '1.125rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Landing;


